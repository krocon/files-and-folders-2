import * as pty from 'node-pty';
import * as path from 'path';
import * as fs from 'fs';
import {ShellSpawnParaIf, ShellSpawnResultIf} from '@fnf-data';

export class ShellSpawnManager {
  private processes: Map<string, pty.IPty> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  private currentDirectories: Map<string, string> = new Map();

  /**
   * Spawns a new process and manages its lifecycle using node-pty
   */
  spawn(
    para: ShellSpawnParaIf,
    onData: (result: ShellSpawnResultIf) => void
  ): void {
    // Clean up any existing process with the same cancelKey
    this.killProcess(para.cancelKey);

    // Get or initialize current directory for this session
    const currentDir = this.getCurrentDirectory(para.cancelKey, para.dir);

    // Check if this is a cd command
    const cdTarget = this.parseCdCommand(para.cmd);
    if (cdTarget !== null) {
      // Handle cd command specially
      try {
        const newDir = this.updateCurrentDirectory(para.cancelKey, cdTarget);
        // Send success result with new directory
        onData({
          out: newDir,
          error: '',
          code: 0,
          done: true,
          emitKey: '',
          hasAnsiEscapes: false,
          currentDir: newDir
        });
        return;
      } catch (error) {
        // Send error result with current directory unchanged
        onData({
          out: '',
          error: error.message,
          code: 1,
          done: true,
          emitKey: '',
          hasAnsiEscapes: false,
          currentDir: currentDir
        });
        return;
      }
    }

    // Parse command and arguments
    const [command, ...args] = para.cmd.split(' ');

    console.info(`Spawning PTY process: ${command} ${args.join(' ')}`);

    try {
      // Get shell from environment or default to bash
      const shell = process.env.SHELL || 'bash';

      // Set default terminal size
      const cols = para.cols || 80;
      const rows = para.rows || 30;

      // Spawn the process using node-pty with tracked current directory
      const ptyProcess = pty.spawn(shell, ['-c', para.cmd], {
        name: 'xterm-color',
        cols: cols,
        rows: rows,
        cwd: currentDir,
        env: process.env,
      });

      // Store the process for later cleanup
      this.processes.set(para.cancelKey, ptyProcess);

      // Set up timeout
      if (para.timeout > 0) {
        const timeoutId = setTimeout(() => {
          this.killProcess(para.cancelKey);
          onData({
            out: '',
            error: 'Process timeout exceeded',
            code: -1,
            done: true,
            emitKey: '',
            hasAnsiEscapes: false,
            pid: ptyProcess.pid,
            currentDir: currentDir
          });
        }, para.timeout);
        this.timeouts.set(para.cancelKey, timeoutId);
      }

      // Handle data from PTY (combines stdout and stderr)
      ptyProcess.onData((data: string) => {
        const hasAnsiEscapes = this.containsAnsiEscape(data);
        onData({
          out: data,
          error: '',
          code: null,
          done: false,
          emitKey: '',
          hasAnsiEscapes: hasAnsiEscapes,
          pid: ptyProcess.pid,
          currentDir: currentDir
        });
      });


      // Handle process exit
      ptyProcess.onExit(({exitCode, signal}) => {
        this.cleanup(para.cancelKey);
        onData({
          out: '',
          error: signal ? `Process terminated by signal: ${signal}` : '',
          code: exitCode,
          done: true,
          emitKey: '',
          hasAnsiEscapes: false,
          pid: ptyProcess.pid,
          currentDir: currentDir
        });
      });

    } catch (error) {
      console.error('Error spawning PTY process:', error);
      onData({
        out: '',
        error: error.message,
        code: -1,
        done: true,
        emitKey: '',
        hasAnsiEscapes: false,
        currentDir: currentDir
      });
    }
  }

  /**
   * Kills a process by its cancelKey
   */
  killProcess(cancelKey: string): boolean {
    const process = this.processes.get(cancelKey);
    if (process) {
      try {
        // For PTY processes, we use kill() method
        process.kill('SIGTERM');

        // Force kill after 5 seconds if still running
        setTimeout(() => {
          try {
            process.kill('SIGKILL');
          } catch (error) {
            // Process might already be dead
            console.warn('Failed to force kill process:', error.message);
          }
        }, 5000);

        // Don't cleanup immediately - let the exit event handle it
        return true;
      } catch (error) {
        console.error('Error killing PTY process:', error);
        // Clean up manually if kill failed
        this.cleanup(cancelKey);
        return false;
      }
    }
    return false;
  }

  /**
   * Gets the number of active processes
   */
  getActiveProcessCount(): number {
    return this.processes.size;
  }

  /**
   * Kills all active processes
   */
  killAllProcesses(): void {
    for (const [cancelKey] of this.processes) {
      this.killProcess(cancelKey);
    }
  }

  /**
   * Gets the current directory for a session, initializing if needed
   */
  private getCurrentDirectory(cancelKey: string, initialDir?: string): string {
    if (!this.currentDirectories.has(cancelKey)) {
      const dir = initialDir || process.cwd();
      this.currentDirectories.set(cancelKey, dir);
      return dir;
    }
    return this.currentDirectories.get(cancelKey)!;
  }

  /**
   * Updates the current directory for a session after a cd command
   */
  private updateCurrentDirectory(cancelKey: string, newDir: string): string {
    const currentDir = this.getCurrentDirectory(cancelKey);
    let resolvedDir: string;

    if (path.isAbsolute(newDir)) {
      resolvedDir = newDir;
    } else {
      resolvedDir = path.resolve(currentDir, newDir);
    }

    // Verify the directory exists
    try {
      if (fs.existsSync(resolvedDir) && fs.statSync(resolvedDir).isDirectory()) {
        this.currentDirectories.set(cancelKey, resolvedDir);
        return resolvedDir;
      } else {
        throw new Error(`Directory does not exist: ${resolvedDir}`);
      }
    } catch (error) {
      throw new Error(`Cannot access directory: ${resolvedDir}`);
    }
  }

  /**
   * Checks if a command is a cd command and extracts the target directory
   */
  private parseCdCommand(cmd: string): string | null {
    const trimmedCmd = cmd.trim();

    // Match various cd command patterns
    const cdMatch = trimmedCmd.match(/^cd\s*(.*)$/);
    if (!cdMatch) {
      return null;
    }

    let targetDir = cdMatch[1].trim();

    // Handle special cases
    if (!targetDir || targetDir === '~') {
      // cd with no args or cd ~ goes to home directory
      return process.env.HOME || process.env.USERPROFILE || process.cwd();
    }

    // Remove quotes if present
    targetDir = targetDir.replace(/^["']|["']$/g, '');

    return targetDir;
  }

  /**
   * Checks if data contains ANSI escape sequences
   */
  private containsAnsiEscape(data: string): boolean {
    // ANSI escape sequences start with ESC (0x1B) followed by [
    // This regex matches common ANSI escape sequences
    const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/;
    return ansiRegex.test(data);
  }

  /**
   * Cleans up process and timeout references
   */
  private cleanup(cancelKey: string): void {
    this.processes.delete(cancelKey);
    this.currentDirectories.delete(cancelKey);

    const timeoutId = this.timeouts.get(cancelKey);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(cancelKey);
    }
  }
}

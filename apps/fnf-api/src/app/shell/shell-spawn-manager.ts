import * as pty from 'node-pty';
import {ShellSpawnParaIf, ShellSpawnResultIf} from '@fnf-data';

export class ShellSpawnManager {
  private processes: Map<string, pty.IPty> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Spawns a new process and manages its lifecycle using node-pty
   */
  spawn(
    para: ShellSpawnParaIf,
    onData: (result: ShellSpawnResultIf) => void
  ): void {
    // Clean up any existing process with the same cancelKey
    this.killProcess(para.cancelKey);

    // Parse command and arguments
    const [command, ...args] = para.cmd.split(' ');

    console.info(`Spawning PTY process: ${command} ${args.join(' ')}`);

    try {
      // Get shell from environment or default to bash
      const shell = process.env.SHELL || 'bash';

      // Set default terminal size
      const cols = para.cols || 80;
      const rows = para.rows || 30;

      // Spawn the process using node-pty
      const ptyProcess = pty.spawn(shell, ['-c', para.cmd], {
        name: 'xterm-color',
        cols: cols,
        rows: rows,
        cwd: process.cwd(),
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
            pid: ptyProcess.pid
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
          pid: ptyProcess.pid
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
          pid: ptyProcess.pid
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
        hasAnsiEscapes: false
      });
    }
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
   * Cleans up process and timeout references
   */
  private cleanup(cancelKey: string): void {
    this.processes.delete(cancelKey);

    const timeoutId = this.timeouts.get(cancelKey);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(cancelKey);
    }
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
}

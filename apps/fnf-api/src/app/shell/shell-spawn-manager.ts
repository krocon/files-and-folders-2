import {ChildProcess, spawn} from 'child_process';
import {ShellSpawnParaIf, ShellSpawnResultIf} from '@fnf-data';

export class ShellSpawnManager {
  private processes: Map<string, ChildProcess> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Spawns a new process and manages its lifecycle
   */
  spawn(
    para: ShellSpawnParaIf,
    onData: (result: ShellSpawnResultIf) => void
  ): void {
    // Clean up any existing process with the same cancelKey
    this.killProcess(para.cancelKey);

    // Parse command and arguments
    const [command, ...args] = para.cmd.split(' ');

    console.info(`Spawning process: ${command} ${args.join(' ')}`);

    try {
      // Spawn the process
      const childProcess = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      // Store the process for later cleanup
      this.processes.set(para.cancelKey, childProcess);

      // Set up timeout
      if (para.timeout > 0) {
        const timeoutId = setTimeout(() => {
          this.killProcess(para.cancelKey);
          onData({
            out: '',
            error: 'Process timeout exceeded',
            code: -1,
            done: true,
            emitKey: ''
          });
        }, para.timeout);
        this.timeouts.set(para.cancelKey, timeoutId);
      }

      // Handle stdout data
      childProcess.stdout?.on('data', (data: Buffer) => {
        onData({
          out: data.toString(),
          error: '',
          code: null,
          done: false,
          emitKey: ''
        });
      });

      // Handle stderr data
      childProcess.stderr?.on('data', (data: Buffer) => {
        onData({
          out: '',
          error: data.toString(),
          code: null,
          done: false,
          emitKey: ''
        });
      });

      // Handle process close
      childProcess.on('close', (code: number | null) => {
        this.cleanup(para.cancelKey);
        onData({
          out: '',
          error: '',
          code: code,
          done: true,
          emitKey: ''
        });
      });

      // Handle process error
      childProcess.on('error', (error: Error) => {
        this.cleanup(para.cancelKey);
        onData({
          out: '',
          error: error.message,
          code: -1,
          done: true,
          emitKey: ''
        });
      });

      // Handle spawn error (command not found)
      childProcess.on('spawn', () => {
        // Process started successfully
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Kills a process by its cancelKey
   */
  killProcess(cancelKey: string): boolean {
    const process = this.processes.get(cancelKey);
    if (process && !process.killed) {
      const killResult = process.kill('SIGTERM');
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (!process.killed) {
          process.kill('SIGKILL');
        }
      }, 5000);
      // Don't cleanup immediately - let the close event handle it
      return killResult;
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

import {exec, spawn} from "child_process";
import {Logger} from "@nestjs/common";
import * as os from "os";

const logger = new Logger("execute-command");
const isWindows = os.platform() === 'win32';

/**
 * Options for executing a command
 */
export interface ExecuteCommandOptions {
  /** Maximum time in milliseconds to wait for command completion (default: 0 - no timeout) */
  timeout?: number;
  /** Whether to use spawn instead of exec (better for large files/outputs) (default: true) */
  useSpawn?: boolean;
}

/**
 * Executes a shell command asynchronously and returns a Promise.
 *
 * This function provides a Promise-based interface for executing shell commands,
 * with options to handle long-running processes more efficiently.
 *
 * @param command - The shell command to execute as a string
 * @param options - Optional configuration for command execution
 * @returns A Promise that resolves when the command completes successfully,
 *          or rejects if the command fails or times out
 * @throws Will reject the promise with the error if command execution fails or times out
 *
 * @example
 * // Execute a simple command
 * await executeCommand('ls -la');
 *
 * @example
 * // Execute a command with a timeout
 * await executeCommand('some-long-running-command', { timeout: 30000 });
 *
 * @example
 * // Handle potential errors
 * try {
 *   await executeCommand('some-command');
 * } catch (error) {
 *   // Handle error
 * }
 *
 * Implementation notes:
 * - Uses Node.js child_process.spawn by default for better handling of large outputs
 * - Can fall back to child_process.exec if specified in options
 * - Supports timeout to prevent indefinite blocking
 * - Logs errors using NestJS Logger
 * - Command runs with default shell and environment variables
 * - Cross-platform compatible (works on Windows, Linux, and macOS)
 */
export async function executeCommand(command: string, options: ExecuteCommandOptions = {}): Promise<void> {
  const {timeout = 0, useSpawn = true} = options;

  if (useSpawn) {
    return executeWithSpawn(command, timeout);
  } else {
    return executeWithExec(command, timeout);
  }
}

/**
 * Execute command using child_process.spawn (better for large outputs)
 *
 * This implementation uses the shell option to ensure cross-platform compatibility.
 * It passes the entire command as a string and lets the system's default shell handle it,
 * which will be cmd.exe on Windows and /bin/sh on Unix-like systems.
 */
function executeWithSpawn(command: string, timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    logger.log(`Executing with spawn: ${command}`);

    // Use platform-specific shell
    const spawnOptions = {
      stdio: [0, 1, 2], // Use numeric values for stdin, stdout, stderr
      shell: true
    };

    // Spawn the process with the full command
    const childProcess = spawn(command, [], spawnOptions);

    let timeoutId: NodeJS.Timeout | null = null;

    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        childProcess.kill();
        reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
      }, timeout);
    }

    childProcess.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      logger.error(error);
      reject(error);
    });

    childProcess.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (code !== 0) {
        const error = new Error(`Command failed with exit code ${code}: ${command}`);
        logger.error(error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Execute command using child_process.exec (legacy method)
 *
 * This implementation uses the shell option to ensure cross-platform compatibility.
 * It passes the entire command as a string and lets the system's default shell handle it,
 * which will be cmd.exe on Windows and /bin/sh on Unix-like systems.
 */
function executeWithExec(command: string, timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    logger.log(`Executing with exec: ${command}`);

    const options = {
      ...(timeout > 0 ? {timeout} : {}),
      shell: isWindows ? 'cmd.exe' : '/bin/sh'
    };

    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);
        reject(error);
      }
      resolve();
    });
  });
}

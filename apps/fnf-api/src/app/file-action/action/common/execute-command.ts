import {exec, spawn} from "child_process";
import {Logger} from "@nestjs/common";

const logger = new Logger("execute-command");

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
 */
function executeWithSpawn(command: string, timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Split the command into the base command and arguments
    const parts = command.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) || [];
    const cmd = parts[0];
    const args = parts.slice(1).map(arg => {
      // Remove quotes if present
      return arg.replace(/^["']|["']$/g, '');
    });

    logger.log(`Executing with spawn: ${cmd} ${args.join(' ')}`);

    const childProcess = spawn(cmd, args, {
      shell: true, // Use shell to handle complex commands
      stdio: 'pipe'
    });

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
 */
function executeWithExec(command: string, timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const options = timeout > 0 ? {timeout} : {};

    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);
        reject(error);
      }
      resolve();
    });
  });
}

import {exec} from "child_process";
import {Logger} from "@nestjs/common";

const logger = new Logger("execute-command");


/**
 * Executes a shell command asynchronously and returns a Promise.
 *
 * This function wraps Node.js child_process.exec in a Promise-based interface,
 * providing a more convenient way to execute shell commands.
 *
 * @param command - The shell command to execute as a string
 * @returns A Promise that resolves when the command completes successfully,
 *          or rejects if the command fails
 * @throws Will reject the promise with the error if command execution fails
 *
 * @example
 * // Execute a simple command
 * await executeCommand('ls -la');
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
 * - Uses Node.js child_process.exec under the hood
 * - Logs errors using NestJS Logger
 * - Does not capture or return stdout/stderr output
 * - Command runs with default shell and environment variables
 */
export async function executeCommand(command: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);
        reject(error);
      }
      resolve();
    });
  });
}

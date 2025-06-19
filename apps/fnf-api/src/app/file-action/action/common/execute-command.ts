import {exec} from "child_process";
import {Logger} from "@nestjs/common";
const logger = new Logger("execute-command");

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

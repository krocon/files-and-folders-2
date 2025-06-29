import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

import * as path from "path";
import * as fs from "fs-extra";
import {environment} from "../../environments/environment";
import {WalkData, WalkParaData} from "@fnf/fnf-data";

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class WalkGateway {

  @WebSocketServer() server: Server;
  private readonly cancellings = {};

  /**
   * Traverses directories and emits events containing information about the processed files and directories.
   * The method processes directories and files, updating statistical data, and emits updates periodically
   * based on the specified steps per message.
   *
   * @param {WalkParaData} walkParaData - An object containing parameters needed for the directory traversal.
   *    - `stepsPerMessage` (number): Determines the interval for emitting progress updates.
   *    - `files` (string[]): A list of file/directory paths to be processed.
   *    - `emmitDataKey` (string): The key used to emit progress data updates.
   *    - `emmitCancelKey` (string): The key used to monitor cancellation requests.
   *
   * @return {void} This function does not return a value; it emits updates to the server instead.
   */
  @SubscribeMessage("walkdir")
  walkdir(@MessageBody() walkParaData: WalkParaData): void {

    (function (walkParaData: WalkParaData, cancellings: {}, server: Server) {

      const walkData = new WalkData();
      const stepsPerMessage = walkParaData.stepsPerMessage;
      const files = [...walkParaData.files];
      let step = 0;

      /**
       * Helper function to emit data with a small delay to ensure the event is processed
       * @param key Event key
       * @param data Data to emit
       * @param callback Function to call after the emit has been processed
       */
      const emitWithDelay = (key: string, data: any, callback: () => void) => {
        server.emit(key, data);
        // Use setImmediate to give the event loop a chance to process the emit
        setImmediate(() => {
          callback();
        });
      };

      const processNextFile = () => {
        if (!files.length) {
          walkData.last = true;
          emitWithDelay(walkParaData.emmitDataKey, walkData, () => {
            // Final emit completed
          });
          return;
        }

        if (cancellings[walkParaData.emmitCancelKey]) {
          return;
        }

        step++;
        const ff = files.pop();

        try {
          const stats = fs.statSync(ff);

          if (stats.isDirectory()) {
            walkData.folderCount++;
            if (step % stepsPerMessage === 0) {
              //console.log(walkData);
              emitWithDelay(walkParaData.emmitDataKey, walkData, processNextFile);
              return;
            }
            const ffs = fs.readdirSync(ff);
            ffs.forEach(f => files.push(path.join(ff, f)));

          } else if (stats.isFile()) {
            walkData.fileCount++;
            walkData.sizeSum = walkData.sizeSum + stats.size;
            if (step % stepsPerMessage === 0) {
              //console.log("emit: " + ff);
              emitWithDelay(walkParaData.emmitDataKey, walkData, processNextFile);
              return;
            }
          }
        } catch (e) {
          // ignore
        }

        // Process next file
        processNextFile();
      };

      // Start processing files
      processNextFile();

    })(walkParaData, this.cancellings, this.server);
  }

  @SubscribeMessage("cancelwalk")
  cancelWalk(@MessageBody() cancelId: string): void {
    this.cancellings[cancelId] = cancelId;
  }


}

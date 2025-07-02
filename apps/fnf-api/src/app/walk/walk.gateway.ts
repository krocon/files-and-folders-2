import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

import * as path from "path";
import * as fs from "fs-extra";
import {environment} from "../../environments/environment";
import {FileItem, FileItemIf, WalkData, WalkParaData} from "@fnf/fnf-data";

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


    const fileItems: FileItemIf[] = walkParaData.files.map(f => {
      // Assume all initial entries are directories as per previous implementation
      const stats = fs.statSync(f);
      return new FileItem(f, '', '', '', stats.size, stats.isDirectory());
    });

    (function (walkParaData: WalkParaData, cancellings: {}, server: Server) {

      const walkData = new WalkData();
      const stepsPerMessage = walkParaData.stepsPerMessage;
      const files: FileItemIf[] = [...fileItems];
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
        const item = files.pop();

        try {
          if (item.isDir) {
            walkData.folderCount++;
            if (step % stepsPerMessage === 0) {
              emitWithDelay(walkParaData.emmitDataKey, walkData, processNextFile);
              return;
            }

            const entries = fs.readdirSync(item.dir, {withFileTypes: true});
            entries.forEach(entry => {
              const fullPath = path.join(item.dir, entry.name);
              const isDir = entry.isDirectory();
              // Get file size using lstatSync for files
              const size = isDir ? 0 : fs.lstatSync(fullPath).size;
              files.push(new FileItem(
                fullPath,
                entry.name,
                '', // ext
                '', // date
                size,  // size from lstatSync for files
                isDir,
                false // abs
              ));
            });
          } else {
            // It's a file
            walkData.fileCount++;
            walkData.sizeSum = walkData.sizeSum + item.size;
          }
        } catch (e) {
          // ignore
        }

        if (step % stepsPerMessage === 0) {
          emitWithDelay(walkParaData.emmitDataKey, walkData, processNextFile);
        } else {
          // Process next file
          processNextFile();
        }


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

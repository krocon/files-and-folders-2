import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

import * as path from "path";
import * as fs from "fs-extra";
import * as micromatch from "micromatch";
import {environment} from "../../environments/environment";
import {DirEvent, FileItem, FindData} from "@fnf/fnf-data";
import {stats2FileItem} from "../dir/stats-to-file";

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class FindGateway {

  @WebSocketServer() server: Server;
  private readonly cancellings = {};

  /**
   * Handles the "openFindDialog" message event by searching for files and directories
   * that match a specified pattern and emitting the search results.
   *
   * @param {FindData} findData - The data needed for performing the openFindDialog operation,
   * including folder(s) to search in, search patterns, and keys for canceling or emitting events.
   * @return {void} This method does not return a value. It emits events with the search results.
   */
  @SubscribeMessage("find")
  find(@MessageBody() findData: FindData): void {


    (function (findData: FindData, cancellings: {}, server: Server) {

      const findDialogData = findData.findDialogData;
      const directoriesOnly = findDialogData.directoriesOnly;
      const dirs: string[] =
        (findDialogData.folders ? findDialogData.folders : [findDialogData.folder])
          .filter(f => fs.existsSync(f));

      if (!dirs.length) {
        const dirEvent = new DirEvent(findData.dirTabKey, [], true, true, 0, "", "list");
        server.emit(findData.emmitDataKey, dirEvent, () => {});
        return;
      }

      const allItems: FileItem[] = [];
      let first = true;

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

      while (dirs.length) {
        if (cancellings[findData.emmitCancelKey]) {
          return;
        }
        const dir = dirs.pop();
        const items: FileItem[] = [];
        try {
          const entries = fs.readdirSync(dir, {withFileTypes: true});

          entries.forEach(entry => {
            const f2 = path.join(dir, entry.name);
            const isDir = typeof entry.isDirectory === 'function' ? entry.isDirectory() : false;

            if (isDir) {
              dirs.push(f2);
            } else {
              if (!directoriesOnly) {
                const base = entry.name;

                if (micromatch.isMatch(path.join(dir, base), findDialogData.pattern)) {
                  const ext = path.extname(f2);
                  const fileItem = new FileItem(dir, base, ext);

                  // Only call statSync when we need the file details
                  const stats2 = fs.lstatSync(f2);
                  stats2FileItem(stats2, fileItem);
                  fileItem.abs = true;
                  items.push(fileItem);
                  allItems.push(fileItem);
                }
              }
            }
          });
        } catch (e) {
          // ignore errors (e.g., permission denied)
        }
        if (items.length) {
          const dirEvent = new DirEvent(findData.dirTabKey, items, first, false, items.length, "", "list");
          emitWithDelay(findData.emmitDataKey, dirEvent, () => {
            // Emit completed
          });
          first = false;
        }
      }
      const dirEvent = new DirEvent(findData.dirTabKey, allItems, true, true, allItems.length, "", "list");
      emitWithDelay(findData.emmitDataKey, dirEvent, () => {
        // Final emit completed
      });
    })(findData, this.cancellings, this.server);
  }

  @SubscribeMessage("cancelfind")
  cancelFind(@MessageBody() cancelId: string): void {
    this.cancellings[cancelId] = cancelId;
  }


}

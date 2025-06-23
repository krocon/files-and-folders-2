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
   * Handles the "find" message event by searching for files and directories
   * that match a specified pattern and emitting the search results.
   *
   * @param {FindData} findData - The data needed for performing the find operation,
   * including folder(s) to search in, search patterns, and keys for canceling or emitting events.
   * @return {void} This method does not return a value. It emits events with the search results.
   */
  @SubscribeMessage("find")
  find(@MessageBody() findData: FindData): void {
    const findDialogData = findData.findDialogData;
    const directoriesOnly = findDialogData.directoriesOnly;
    const dirs: string[] = findDialogData.folders ? findDialogData.folders : [findDialogData.folder];
    const allItems: FileItem[] = [];
    let first = true;
    while (dirs.length) {
      if (this.cancellings[findData.emmitCancelKey]) {
        return;
      }
      const dir = dirs.pop();
      const items: FileItem[] = [];
      const ffs = fs.readdirSync(dir);
      ffs.forEach(f => {
        const f2 = path.join(dir, f);
        const stats2 = fs.statSync(f2);
        if (stats2.isDirectory()) {
          dirs.push(f2);

        } else {
          if (!directoriesOnly) {
            const dir = path.dirname(f2);
            const base = path.basename(f2);

            // console.log(path.join(dir, base)+ ", find "+findDialogData.pattern + ',   ' +
            //   (micromatch.isMatch(path.join(dir, base), findDialogData.pattern))
            // );
            if (micromatch.isMatch(path.join(dir, base), findDialogData.pattern)) {
              const ext = path.extname(f2);
              const fileItem = new FileItem(dir, base, ext);

              stats2FileItem(stats2, fileItem);
              fileItem.abs = true;
              items.push(fileItem);
              allItems.push(fileItem);
            }
          }
        }
      });
      if (items.length) {
        const dirEvent = new DirEvent(findData.dirTabKey, items, first, false, items.length, "", "list");
        this.server.emit(findData.emmitDataKey, dirEvent);
        first = false;
      }
    }
    const dirEvent = new DirEvent(findData.dirTabKey, allItems, true, true, allItems.length, "", "list");
    this.server.emit(findData.emmitDataKey, dirEvent);
  }

  @SubscribeMessage("cancelfind")
  cancelFind(@MessageBody() cancelId: string): void {
    this.cancellings[cancelId] = cancelId;
  }


}

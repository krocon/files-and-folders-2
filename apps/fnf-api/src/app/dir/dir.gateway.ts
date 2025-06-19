import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

import * as path from "path";
import * as fs from "fs-extra";
import {DirEvent, DirPara, FileItem, fixPath, getZipUrlInfo, isZipUrl} from '@fnf/fnf-data';
import {environment} from "../../environments/environment";
import {FSWatcher} from "chokidar";
import {Observable} from "rxjs";
import {WatchEventData} from "./watch-event.data";
import {distinctUntilChanged} from "rxjs/operators";
import {unpacklist} from "../file-action/action/unpack-list.fn";
import {stats2FileItem} from "./stats-to-file";

/**
 * WebSocket gateway that handles directory-related operations including file watching,
 * directory listing, and ZIP file handling.
 *
 * This gateway operates on the port specified in environment.websocketPort with
 * CORS options defined in environment.websocketOptions.
 *
 * @WebSocketGateway manages the following operations:
 * - Real-time file system watching
 * - Directory listing (both regular directories and ZIP files)
 * - File system change notifications
 */
@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class DirGateway {
  /** Socket.io server instance for WebSocket communications */
  @WebSocketServer() server: Server;

  /** File system watcher instance for monitoring directory changes */
  private fsWatcher: FSWatcher;

  /**
   * Initializes the DirGateway and sets up file system watching.
   * Creates an FSWatcher instance with specific configuration:
   * - ignoreInitial: true (doesn't emit events for existing files)
   * - depth: 0 (only watches immediate directory contents)
   * - atomic: true (ensures atomic writes)
   *
   * Sets up error handling and file change monitoring using RxJS Observables.
   */
  constructor() {
    this.fsWatcher = new FSWatcher({
      ignoreInitial: true,
      // disableGlobbing: true,
      depth: 0,
      atomic: true
    });

    // Add error event handler to prevent app crash on permission errors
    this.fsWatcher.on('error', (error) => {
      console.error('FSWatcher error:', error);
      // Just log the error without crashing the application
    });

    new Observable<WatchEventData>(
      (subscriber) => {
        this.fsWatcher
          .on("all", (event, f) => {
            subscriber.next(new WatchEventData(event, f));
          });
      })
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev?.event === curr.event && prev?.file === curr.file)
      )
      .subscribe(
        {
          next: wed => {
            if (wed.event === "add" || wed.event === "addDir") {
              const fileItem = this.createFileItem(wed.file);
              const dirEvent = new DirEvent(fileItem.dir, [fileItem], false, false, 1, "", wed.event);
              this.server.emit("watching", dirEvent);

            } else if (wed.event === "unlink" || wed.event === "unlinkDir" || wed.event === "change") {
              const fileItem = this.createFileItemByFullPath(wed.file);
              fileItem.isDir = wed.event === "unlinkDir";
              const dirEvent = new DirEvent(fileItem.dir, [fileItem], false, false, 1, "", wed.event);
              this.server.emit("watching", dirEvent);
            }
          },
          error: error => {
            console.error(error);
          }
      });

  }

  /**
   * Handles "watch" WebSocket messages to start watching a directory.
   * Verifies directory existence and read permissions before adding to watcher.
   *
   * @param para - Directory parameters containing the path to watch
   */
  @SubscribeMessage("watch")
  watch(@MessageBody() para: DirPara): void {
    if (fs.existsSync(para.path)) {
      try {
        // Check if we have read permission before adding to watcher
        fs.accessSync(para.path, fs.constants.R_OK); // Throws an error if access is not allowed

        this.fsWatcher.add(para.path);

      } catch (e) {
        console.warn('Error watching path:', para.path, e);
        // Don't add the path to the watcher if we don't have permission
      }
    }
  }

  /**
   * Handles "unwatch" WebSocket messages to stop watching a directory.
   *
   * @param para - Directory parameters containing the path to unwatch
   */
  @SubscribeMessage("unwatch")
  unwatch(@MessageBody() para: DirPara): void {
    if (fs.existsSync(para.path)) {
      try {
        this.fsWatcher.unwatch(para.path);
      } catch (e) {
        console.error('Error unwatching path:', para.path, e);
      }
    }
  }

  /**
   * Handles "dir" WebSocket messages to list directory contents.
   * Supports both regular directories and ZIP file contents.
   *
   * @param para - Directory parameters containing the path to list
   */
  @SubscribeMessage("dir")
  onDir(@MessageBody() para: DirPara): void {
    let p = para.path;
    if (p.indexOf(":") === p.length - 1) p = path.join(p, "/");
    p = fixPath(p);

    const emmitKey = `dir${para.rid}`;

    try {
      if (isZipUrl(p)) {
        this.readZipDir(p, emmitKey);
      } else {
        this.readdir(p, emmitKey);
      }
    } catch (e) {
      console.error(e);
      const ev = new DirEvent(p, [], true, true, 0, e);
      this.server.emit(emmitKey, ev);
    }
  }

  /**
   * Creates a FileItem instance from a full file path.
   *
   * @param full - Complete file path
   * @returns FileItem instance containing file information
   * @private
   */
  private createFileItemByFullPath(full: string): FileItem {
    return new FileItem(path.dirname(full), path.basename(full), path.extname(full));
  }

  /**
   * Reads and emits contents of a ZIP file.
   *
   * @param file - Path to the ZIP file
   * @param emmitKey - WebSocket event key for emitting results
   * @private
   */
  private readZipDir(file: string, emmitKey: string): void {
    const zipUrlInfo = getZipUrlInfo(file);
    unpacklist(zipUrlInfo.zipUrl)
      .then(ev => {
        this.server.emit(emmitKey, ev);
      });
  }

  /**
   * Reads and emits contents of a directory.
   * Handles large directories by optionally sending preview events.
   *
   * @param p - Directory path to read
   * @param emmitKey - WebSocket event key for emitting results
   * @private
   */
  private readdir(p: string, emmitKey: string): void {
    const socket = this.server;
    try {
      if (fs.existsSync(p)) {
        const files = fs.readdirSync(p); //, (error, files) => {
        const allAtOnce = files.length < 10000;

        if (!allAtOnce) {
          const previews = files.map(
            (f) => new FileItem(p, fixPath(f), path.extname(f))
          );
          const end = files.length === 0;
          const firstEvent = new DirEvent(p, previews, true, end, files.length, "", "listpreview");
          socket.emit(emmitKey, firstEvent);
        }

        const fileItems: FileItem[] = [];
        for (let idx = 0; idx < files.length; idx++) {
          const f = files[idx];
          const ff = path.join(p, "/", f);

          const fileItem = new FileItem(
            p,
            fixPath(f),
            path.extname(f),
            null
          );
          fileItems.push(fileItem);

          const dirEvent = new DirEvent(p, [fileItem]);

          try {
            const stats = fs.statSync(ff);
            stats2FileItem(stats, fileItem);
          } catch (e) {
            if (!fileItem.meta) fileItem.meta = {};
            fileItem.meta.error = e;
            console.info("DirGateWay() stats error:", e.message);
          }
          if (idx === files.length - 1) {
            dirEvent.end = true;
          }
          if (!allAtOnce) {
            socket.emit(emmitKey, dirEvent);
          }
        } // for

        if (allAtOnce) {
          const dirEvent = new DirEvent(p, fileItems, true, true, fileItems.length, "", "list");
          socket.emit(emmitKey, dirEvent);
        }
      } else {
        const dirEvent = new DirEvent(p, [], true, true, 0, "Error! Folder does not exist: " + p, "list");
        socket.emit(emmitKey, dirEvent);
      }
    } catch (e) {
      console.error(e);
      const dirEvent = new DirEvent(p, [], true, true, 0, "Error: " + e, "list");
      socket.emit(emmitKey, dirEvent);
    }
  }

  /**
   * Creates a FileItem instance with full stats information.
   *
   * @param file - Path to the file
   * @returns FileItem instance with complete file information
   * @private
   */
  private createFileItem(file: string): FileItem {
    const stats = fs.statSync(file);

    const dir = path.dirname(file);
    const base = path.basename(file);
    const ext = path.extname(file);
    const fileItem = new FileItem(dir, base, ext, null);

    stats2FileItem(stats, fileItem);

    return fileItem;
  }
}
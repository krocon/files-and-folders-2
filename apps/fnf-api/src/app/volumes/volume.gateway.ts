import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";

import * as path from "path";
import * as fs from "fs-extra";
import {environment} from "../../environments/environment";
import {FSWatcher} from "chokidar";


@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class VolumeGateway {

  private static readonly VOLUMES = "/Volumes";

  @WebSocketServer() server: Server;
  private fsWatcher: FSWatcher;


  constructor() {
    this.fsWatcher = new FSWatcher({
      ignoreInitial: true,
      depth: 0,
      atomic: true
    });
    this.fsWatcher.on('error', (error) => console.error('FSWatcher error:', error));
    this.fsWatcher
      .add(VolumeGateway.VOLUMES)
      .on("all", (event, f) => {
        this.volumes();
      });
  }

  @SubscribeMessage("getvolumes")
  volumes(): void {
    this.server.emit("volumes", this.getVolumns());
  }

  getVolumns() {
    const volumes = fs
      .readdirSync(VolumeGateway.VOLUMES, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(VolumeGateway.VOLUMES, dirent.name))

    console.log(volumes);
    return volumes;
  }


}

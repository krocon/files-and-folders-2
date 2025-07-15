import {Injectable} from "@angular/core";
import {WalkParaData} from "@fnf/fnf-data";
import {WalkCallback, WalkSocketService} from "./walk.socketio.service";
import {WalkdirSyncService} from "./walkdir-sync.service";


@Injectable({
  providedIn: "root"
})
export class WalkdirService {

  private rid: number = Math.floor(Math.random() * 1000000) + 1;

  private static readonly config = {
    walkdirSyncUrl: "/api/walkdirsync",
    syncMode: true
  };

  constructor(
    private readonly walkSocketService: WalkSocketService,
    private readonly walkdirSyncService: WalkdirSyncService
  ) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(WalkdirService.config, config);
  }


  walkDir(
    pathes: string[],
    filePattern: string,
    callback: WalkCallback
  ): string {

    this.rid++;
    const listenKey = `walk${this.rid}`;
    const cancelKey = `cancelwalk${this.rid}`;
    const walkParaData = new WalkParaData(pathes, filePattern, listenKey, cancelKey);
    if (!walkParaData.filePattern) walkParaData.filePattern = '**/*';

    if (WalkdirService.config.syncMode) {
      this.walkdirSyncService.walkDirSync(walkParaData, callback);
    } else {
      return this.walkSocketService.walkDir(walkParaData, callback);
    }
    return cancelKey;
  }


  cancelWalkDir(cancelKey: string) {
    if (WalkdirService.config.syncMode) {
      this.walkdirSyncService.cancelWalkDir(cancelKey);
    } else {
      return this.walkSocketService.cancelWalkDir(cancelKey);
    }
  }
}
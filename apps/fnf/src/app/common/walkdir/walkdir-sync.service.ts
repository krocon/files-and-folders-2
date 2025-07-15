import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WalkData, WalkParaData} from "@fnf/fnf-data";
import {WalkCallback} from "./walk.socketio.service";


@Injectable({
  providedIn: "root"
})
export class WalkdirSyncService {


  private static readonly config = {
    walkdirSyncUrl: "/api/walkdirsync",
    syncMode: true
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(WalkdirSyncService.config, config);
  }


  walkDirSync(
    data: WalkParaData,
    callback: WalkCallback): void {

    const sub = this.httpClient
      .post<WalkData>(
        WalkdirSyncService.config.walkdirSyncUrl,
        data
      )
      .subscribe((walkData: WalkData) => {
        callback(walkData);
        sub.unsubscribe();
      });
  }

  cancelWalkDir(cancelKey: string) {
    // nothing
  }
}
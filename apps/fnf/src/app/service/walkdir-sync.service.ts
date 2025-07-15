import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WalkData, WalkParaData} from "@fnf/fnf-data";


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


  walkdirSync(data: WalkParaData): Observable<WalkData> {
    if (!data.filePattern) data.filePattern = '**/*';

    return this.httpClient
      .post<WalkData>(
        WalkdirSyncService.config.walkdirSyncUrl,
        data
      );
  }
}
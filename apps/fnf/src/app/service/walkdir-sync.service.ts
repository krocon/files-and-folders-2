import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WalkData, WalkParaData} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class WalkdirSyncService {


  private static readonly config = {
    walkdirSyncUrl: "/api/walkdirsync"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(WalkdirSyncService.config, config);
  }


  walkdirSync(data: WalkParaData): Observable<WalkData> {
    return this.httpClient
      .post<WalkData>(
        WalkdirSyncService.config.walkdirSyncUrl,
        data
      );
  }
}
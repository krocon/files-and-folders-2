import {Injectable} from "@angular/core";
import {SysinfoIf} from "@fnf/fnf-data";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class SysinfoService {

  private static readonly config = {
    getDrivesUrl: "/api/drives",
    getSysinfoUrl: "/api/sysinfo",
    getFirstStartFolderUrl: "/api/firststartfolder"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(SysinfoService.config, config);
  }


  getDrives(): Observable<string[]> {
    return this.httpClient.get<string[]>(SysinfoService.config.getDrivesUrl);
  }

  getSysinfo(): Observable<SysinfoIf> {
    return this.httpClient.get<SysinfoIf>(SysinfoService.config.getSysinfoUrl);
  }

  getFirstStartFolder(): Observable<string> {
    return this.httpClient.get<string>(SysinfoService.config.getFirstStartFolderUrl);
  }
}

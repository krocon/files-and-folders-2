import {Injectable} from "@angular/core";
import {SysinfoIf} from "@fnf/fnf-data";
import {firstValueFrom, Observable} from "rxjs";
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

  getSysinfo(): Promise<SysinfoIf> {
    return firstValueFrom(this.httpClient.get<SysinfoIf>(SysinfoService.config.getSysinfoUrl));
  }

  getFirstStartFolder(): Promise<string> {
    return firstValueFrom(this.httpClient.get<string>(SysinfoService.config.getFirstStartFolderUrl));
  }
}

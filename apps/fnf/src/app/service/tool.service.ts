import {Injectable} from "@angular/core";
import {BrowserOsType, CmdIf, DirEventIf} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ToolService {

  private static readonly config = {
    loadUrl: "/assets/config/tool/",
    shellUrl: "/api/shell",
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ToolService.config, config);
  }


  public fetchTools(f: BrowserOsType): Observable<CmdIf[] | undefined> {
    return this.httpClient
      .get<CmdIf[]>(ToolService.config.loadUrl + f + '.json');
  }


  execute(cmds: CmdIf[]) {
    // this.socket.emit('shell', cmds);
    this.httpClient
      .post<DirEventIf[]>(ToolService.config.shellUrl, cmds)
      .subscribe();
  }


}

import {Injectable} from "@angular/core";
import {BrowserOsType, CmdIf, DirEventIf} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";

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


  public async fetchTools(f: BrowserOsType): Promise<CmdIf[] | undefined> {
    return await this.httpClient
      .get<CmdIf[]>(ToolService.config.loadUrl + f + '.json')
      .toPromise();
  }


  execute(cmds: CmdIf[]) {
    // this.socket.emit('shell', cmds);
    this.httpClient
      .post<DirEventIf[]>(ToolService.config.shellUrl, cmds)
      .subscribe();
  }


}

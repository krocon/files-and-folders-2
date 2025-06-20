import {Injectable} from "@angular/core";
import {CmdIf, DirEventIf, SysinfoIf} from "@fnf/fnf-data";
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";
import {ShortcutActionMapping} from "./shortcut.service";

@Injectable({
  providedIn: "root"
})
export class ToolService {

  private static readonly config = {
    loadUrl: "/assets/config/tool/",
    shellUrl: "/api/shell",
  };

  constructor(
    private readonly httpClient: HttpClient,
    private readonly socket: Socket,
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ToolService.config, config);
  }



  public async fetchTools(f: 'osx'|'windows'): Promise<CmdIf[]|undefined> {
    return await this.httpClient
      .get<CmdIf[]>(ToolService.config.loadUrl+f+'.json')
      .toPromise();
  }


  execute(cmds: CmdIf[]) {
    // this.socket.emit('shell', cmds);
    this.httpClient
      .post<DirEventIf[]>(ToolService.config.shellUrl, cmds)
      .subscribe();
  }


}

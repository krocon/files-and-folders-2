import {Injectable} from "@angular/core";
import {CmdIf, DirEventIf, SysinfoIf} from "@fnf/fnf-data";
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ToolService {

  private static readonly config = {
    shellUrl: "/api/shell"
  };

  constructor(
    private readonly httpClient: HttpClient,
    private readonly socket: Socket,
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ToolService.config, config);
  }


  execute(cmds: CmdIf[]) {
    // this.socket.emit('shell', cmds);
    this.httpClient
      .post<DirEventIf[]>(ToolService.config.shellUrl, cmds)
      .subscribe();
  }



  getDefaultTools(systemFlags: SysinfoIf): CmdIf[] {
    const ret: CmdIf[] = [];
    if (systemFlags.windows) {
      ret.push({
        id: 'CMD_SHELL',
        label: 'CMD Shell',
        shortcut: 'control shift m', // todo $_dirname
        cmd: '$clidir\\cmd.bat', // (server/cli/cmd.bat ->) start C:\Windows\System32\cmd.exe /a /k cd /d %1
        para: ' $dir ',
        local: true
      });

    } else if (systemFlags.osx) {
      ret.push({
        id: 'EDIT_FILE',
        label: 'Edit',
        shortcut: 'control 4',
        // ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime
        // see http://olivierlacan.com/posts/launch-sublime-text-3-from-the-command-line/
        cmd: 'code',
        fileLimit: 4,
        para: ' $file ',
        local: true
      });
      ret.push({
        "id": "CMD_SHELL",
        "label": "CMD Shell",
        "shortcut": "control 0",
        "cmd": "open -a Terminal ",
        "para": " $dir ",
        "local": true
      });
      ret.push({
        "id": "CMD_REVEAL_IN_FINDER",
        "label": "Reveal in Finder",
        "shortcut": "control shift f",
        "cmd": "open ",
        "para": " $dir ",
        "local": true
      });

      // https://www.npmjs.com/package/ttab#manual-installation
      // https://www.safaribooksonline.com/library/view/mac-os-x/9780596520625/ch01.html
      // http://stackoverflow.com/questions/7171725/open-new-terminal-tab-from-command-line-mac-os-x

    } else if (systemFlags.linux) {

    }

    return ret;
  };
}

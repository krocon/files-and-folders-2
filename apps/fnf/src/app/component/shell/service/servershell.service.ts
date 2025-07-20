import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {ShellCancelSpawnParaIf, ShellSpawnParaIf, ShellSpawnResultIf} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class ServershellService {


  private static readonly config = {
    spawnUrl: "/api/spawn",
    cancelSpawnUrl: "/api/cancelspawn",
  };

  constructor(
    private readonly httpClient: HttpClient,
    private readonly socket: Socket
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ServershellService.config, config);
  }


  doSpawn(para: ShellSpawnParaIf, callback: (result: ShellSpawnResultIf) => void) {
    console.log('doSpawn  para', para);

    // Listen for responses on the emitKey
    this.socket.on(para.emitKey, (result: ShellSpawnResultIf) => {
      callback(result);
    });

    // Send the spawn command to the server
    this.socket.emit('spawn', para);
    // this.httpClient
    //   .post<ShellSpawnResultIf>(ServershellService.config.spawnUrl, para)
    //   .subscribe(_ => {
    //   });
  }

  doCancelSpawn(cancelKey: string) {
    const cancelPara: ShellCancelSpawnParaIf = {
      cancelKey: cancelKey
    };

    // Send the cancel command to the server
    this.socket.emit('cancelspawn', cancelPara);

    // Clean up the listener for this emitKey
    const emitKey = cancelKey.replace('cancelServerShell', 'ServerShell');
    this.socket.off(emitKey);
  }

}

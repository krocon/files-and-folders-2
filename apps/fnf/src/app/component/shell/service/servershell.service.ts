import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {ShellSpawnParaIf, ShellSpawnResultIf} from "@fnf/fnf-data";


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
//
//     const emitKey = `ServerShell${this.rid}`;
//     const cancelKey = `cancelServerShell${this.rid}`;
//
//     ServershellComponent lauscht via socket (import {Socket} from "ngx-socket-io";) und emitKey auf die Rückgabe vom Server.
  }

  doCancelSpawn() {

  }

}
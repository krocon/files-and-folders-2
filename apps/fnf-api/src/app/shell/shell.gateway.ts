import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {environment} from "../../environments/environment";
import {ShellCancelSpawnParaIf, ShellSpawnParaIf, ShellSpawnResultIf} from "@fnf-data";
import {ShellSpawnManager} from "./shell-spawn-manager";


@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class ShellGateway {

  @WebSocketServer() server: Server;

  private spawnManager: ShellSpawnManager = new ShellSpawnManager();

  private counter = 0;

  @SubscribeMessage("spawn")
  doSpawn(@MessageBody() para: ShellSpawnParaIf): void {
    console.log("ShellGateway doSpawn() para:", para);

    this.spawnManager.spawn(para, (result: ShellSpawnResultIf) => {
      result.emitKey = para.emitKey;
      console.log("ShellGateway doSpawn() result (" + (this.counter++) + "):", result);
      this.server.emit(para.emitKey, result);
    });
  }

  @SubscribeMessage("cancelspawn")
  doCancelSpawn(@MessageBody() para: ShellCancelSpawnParaIf): void {
    const killed = this.spawnManager.killProcess(para.cancelKey);
    if (killed) {
      // Optionally emit a cancellation confirmation
      this.server.emit(`${para.cancelKey}_cancelled`, {cancelled: true});
    }
  }
}

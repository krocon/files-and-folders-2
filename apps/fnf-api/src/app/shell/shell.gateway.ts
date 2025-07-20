import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {environment} from "../../environments/environment";

const {spawn} = require('child_process');


@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class ShellGateway {


  @WebSocketServer() server: Server;


  @SubscribeMessage("spawn")
  doSpawn(@MessageBody() para: { // TODO para -> interface
    cmd: string,
    emitKey: string,
    cancelKey: string,
    timeout: number /* 60.000 */,
  }): void {
    const socket = this.server;
    // TODO

    /*
    example:
    const top = spawn('top');

    top.stdout.on('data', (data) => {
      console.log(data.toString());
      socket.emit(emitKey, {
        out: data.toString(),
        error:'',
        code:number,
        done: false
        });
    });

    top.stderr.on('data', (data) => {
      //
    });

    top.on('close', (code) => {
      //
    });
     */
  }

  @SubscribeMessage("cancelspawn")
  doCancelSpawn(@MessageBody() para: {
    cancelKey: string,
  }): void {
    // TODO kill process (listening,...) with cancelKey
  }
}
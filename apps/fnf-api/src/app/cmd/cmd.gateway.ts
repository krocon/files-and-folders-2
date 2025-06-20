import {MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";



import {environment} from "../../environments/environment";
import {CmdIf} from "@fnf/fnf-data";
import {Logger} from "@nestjs/common";


@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class CmdGateway {

  readonly logger = new Logger("shell");


  @SubscribeMessage("shell")
  shell(@MessageBody() cmds: CmdIf[]): void {
    this.logger.log("shell() cmds:" + cmds);
  }


}

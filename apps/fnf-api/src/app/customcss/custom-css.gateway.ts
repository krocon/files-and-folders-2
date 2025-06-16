import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {environment} from "../../environments/environment";
import {CssColors} from "@fnf/fnf-data";

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class CustomCssGateway {

  @WebSocketServer() server: Server;

  @SubscribeMessage("updateCss")
  updateCss(@MessageBody() cssvars: CssColors): void {
    this.server.emit("onCssUpdate", cssvars);
  }

}

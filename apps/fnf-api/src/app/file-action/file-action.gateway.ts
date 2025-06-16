import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {environment} from "../../environments/environment";
import {ActionGatewayKeys as keys, FilePara} from "@fnf/fnf-data";
import {Logger} from "@nestjs/common";
import {FileService} from "./file.service";

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class FileActionGateway {

  @WebSocketServer() server: Server;

  private readonly logger = new Logger(FileActionGateway.name);

  constructor(
    private readonly fileService: FileService
  ) {
  }


  @SubscribeMessage(keys.MULTI_DO)
  onMultiDo(@MessageBody() paras: FilePara[]): void {
    for (let i = 0; i < paras.length; i++) {
      const para = paras[i];
      this.logger.log("onMultiDo() cmd:" + para.cmd);

      const fn = this.fileService.getFunctionByCmd(para.cmd);
      this.logger.log("onMultiDo()  fn:" + fn);
      try {
        fn(para)
          .then(event => {
            this.server.emit(keys.ON_MULTI_DO_DONE, event);
          })
          .catch(e => {
            this.server.emit(keys.ON_MULTI_DO_ERROR, para);
          });
      } catch (e) {
        this.server.emit(keys.ON_MULTI_DO_ERROR, para);
      }
    }
  }


}


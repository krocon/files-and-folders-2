import {Controller, Logger, Post} from "@nestjs/common";
import {CmdIf} from "@fnf/fnf-data";
import {MessageBody} from "@nestjs/websockets";

@Controller("shell")
export class ConfigController {

  readonly logger = new Logger("shell");

  @Post("")
  shell(
    @MessageBody() cmds: CmdIf[]
  ): void {
    this.logger.log("_____shell() cmds:" + cmds);
  }
}

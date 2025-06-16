import {Controller, Post} from "@nestjs/common";
import {MessageBody} from "@nestjs/websockets";
import {DirEvent, DirPara} from "@fnf/fnf-data";
import {DirService} from "./dir-service";


@Controller()
export class DirController {

  constructor(private readonly dirService: DirService) {
  }

  @Post("readdir")
  readdir(@MessageBody() para: DirPara): Promise<DirEvent[]> {
    return this.dirService.readdir(para);
  }

}

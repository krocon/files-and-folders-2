import {Controller, Logger, Post} from "@nestjs/common";
import {FileService} from "./file.service";
import {MessageBody} from "@nestjs/websockets";
import {DirEventIf, DirPara, FilePara, OnDoResponseType, WalkData, WalkParaData} from "@fnf/fnf-data";

import * as fs from "fs-extra";
import * as path from "path";



@Controller("do")
export class FileActionController {

  private readonly logger = new Logger(FileActionController.name);

  constructor(
    private readonly fileService: FileService
  ) {
  }

  @Post("")
  async onDo(@MessageBody() para: FilePara): Promise<OnDoResponseType> {
    this.logger.log("cmd:", para.cmd);
    let fn = this.fileService.getFunctionByCmd(para.cmd);
    return fn(para);
  }


  @Post("unpacklist")
  async unpacklist(@MessageBody() para: DirPara): Promise<DirEventIf> {
    return this.fileService.unpacklist(para.path);
  }

  @Post("walkdir")
  walkdir(@MessageBody() walkParaData: WalkParaData): WalkData {
    const walkData = new WalkData();
    const buf = [...walkParaData.files];

    while (buf.length) {
      const ff = buf.pop();
      const stats = fs.statSync(ff);
      if (stats.isDirectory()) {
        walkData.folderCount++;
        const ffs = fs.readdirSync(ff);
        ffs.forEach(f => buf.push(path.join(ff, f)));
      } else if (stats.isFile()) {
        walkData.fileCount++;
        walkData.sizeSum = walkData.sizeSum + stats.size;
      }
    }
    return walkData;
  }

}

import {Controller, Logger, Post} from "@nestjs/common";
import {FileService} from "./file.service";
import {MessageBody} from "@nestjs/websockets";
import {DirEventIf, DirPara, FilePara, OnDoResponseType} from "@fnf/fnf-data";


@Controller("do")
export class FileActionController {

  private readonly logger = new Logger(FileActionController.name);

  constructor(
    private readonly fileService: FileService
  ) {
  }

  @Post("")
  async onDo(@MessageBody() para: FilePara): Promise<OnDoResponseType> {
    console.info("cmd:", para.cmd);
    let fn = this.fileService.getFunctionByCmd(para.cmd);
    return fn(para);
  }


  @Post("unpacklist")
  async unpacklist(@MessageBody() para: DirPara): Promise<DirEventIf> {
    return this.fileService.unpacklist(para.path);
  }

  // @Post("walkdir")
  // walkdir(@MessageBody() walkParaData: WalkParaData): WalkData {
  //
  //   console.info("walkdir() walkParaData:", walkParaData);
  //   const walkData = new WalkData();
  //   const buf = [...walkParaData.files];
  //
  //   while (buf.length) {
  //     const ff = buf.pop();
  //     const stats = fs.statSync(ff);
  //     console.info(ff, stats); // TODO del
  //     if (stats.isDirectory()) {
  //       walkData.folderCount++;
  //       const ffs = fs.readdirSync(ff);
  //       ffs.forEach(f => buf.push(path.join(ff, f)));
  //
  //     } else if (stats.isFile()) {
  //       walkData.fileCount++;
  //       walkData.sizeSum = walkData.sizeSum + stats.size;
  //       console.info('walkData.sizeSum:'+walkData.sizeSum +', stats:'+ stats.size); // TODO del
  //     }
  //   }
  //   return walkData;
  // }

}

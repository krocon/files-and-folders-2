import {Controller, Get} from "@nestjs/common";
import {SysinfoService} from "./sysinfo.service";
import {Observable} from "rxjs";
import {AllinfoIf, SysinfoIf} from "@fnf/fnf-data";


@Controller()
export class SysinfoController {

  constructor(
    private readonly sysinfoService: SysinfoService
  ) {
  }

  @Get("sysinfo")
  getData(): Observable<SysinfoIf> {
    return this.sysinfoService.getData();
  }

  @Get("firststartfolder")
  getFirstStartFolder(): string {
    let firstStartFolder = this.sysinfoService.getFirstStartFolder();
    return `"${firstStartFolder}"`;
  }


  @Get("allinfo")
  getAllInfo(): Promise<AllinfoIf> {
    return this.sysinfoService.getAllInfo();
  }
}

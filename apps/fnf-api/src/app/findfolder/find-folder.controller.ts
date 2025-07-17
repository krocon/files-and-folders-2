import {Body, Controller, Post} from "@nestjs/common";
import {FindFolderService} from "./find-folder.service";
import {Observable} from "rxjs";
import {FindFolderPara} from "@fnf-data";
import {fromPromise} from "rxjs/internal/observable/innerFrom";


@Controller()
export class FindFolderController {


  constructor(
    private readonly findFolderService: FindFolderService
  ) {
  }


  @Post("findfolders")
  findFolders(
    @Body() para: FindFolderPara
  ): Observable<string[]> {
    return fromPromise(this.findFolderService.findFolders(para));
  }

}
import {DynamicModule, Module} from "@nestjs/common";
import {FindFolderService} from "./find-folder.service";
import {FindFolderController} from "./find-folder.controller";
import {Config} from "@fnf/fnf-data";

@Module({
  controllers: [
    FindFolderController
  ]
})
export class FindFolderModule {

  public static forRoot(config: Config): DynamicModule {
    FindFolderService.config = config;

    return {
      module: FindFolderModule,
      providers: [
        FindFolderService
      ]
    };
  }

}

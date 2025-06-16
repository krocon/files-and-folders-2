import {DynamicModule, Module} from "@nestjs/common";
import {DirGateway} from "./dir.gateway";
import {DirService} from "./dir-service";
import {DirController} from "./dir.controller";
import {Config} from "@fnf/fnf-data";


@Module({
  imports: [],
  controllers: [
    DirController
  ],
  exports: [
    DirGateway
  ]
})
export class DirModule {

  public static forRoot(config: Config): DynamicModule {
    DirService.config = config;
    return {
      module: DirModule,
      providers: [
        DirGateway,
        DirService
      ]
    };
  }
}

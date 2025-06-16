import {DynamicModule, Module} from "@nestjs/common";
import {DrivesService} from "./drives.service";
import {DrivesController} from "./drives.controller";
import {Config} from "@fnf/fnf-data";

@Module({
  controllers: [
    DrivesController
  ]
})
export class DrivesModule {

  public static forRoot(config: Config): DynamicModule {
    DrivesService.config = config;
    return {
      module: DrivesModule,
      providers: [
        DrivesService
      ]
    };
  }

}

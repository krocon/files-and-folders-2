import {DynamicModule, Logger, Module} from "@nestjs/common";
import {ConfigService} from "./config.service";
import {ConfigController} from "./config.controller";
import {Config} from "@fnf/fnf-data";


@Module({
  controllers: [ConfigController]
})
export class ConfigModule {

  public static forRoot(config: Config): DynamicModule {
    if (config) {
      ConfigService.config = config;
      Logger.log("ConfigModule config -> " + JSON.stringify(config, null, 2));
    }
    return {
      module: ConfigModule,
      providers: [
        ConfigService
      ]
    };
  }

}

import {Controller, Get} from "@nestjs/common";
import {ConfigService} from "./config.service";
import {Config} from "@fnf/fnf-data";

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {
  }

  @Get("config")
  getConfig(): Config {
    return this.configService.getData();
  }
}

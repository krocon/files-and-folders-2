import {Module} from "@nestjs/common";
import {ShellController} from "./shell.controller";


@Module({
  imports: [],
  controllers: [
    ShellController
  ]
})
export class ShellModule {
}

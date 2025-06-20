import {Module} from "@nestjs/common";
// import {CmdGateway} from "./cmd.gateway";
import {ConfigController} from "./cmd.controller";


@Module({
  imports: [],
  controllers: [
    ConfigController
  ],
  providers: [
    // CmdGateway
  ],
  exports: [
    // CmdGateway
  ]
})
export class CmdModule {
}

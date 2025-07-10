import {Module} from "@nestjs/common";
import {CheckGlobController} from "./checkglob.controller";

@Module({
  controllers: [
    CheckGlobController
  ]
})
export class CheckGlobModule {
}
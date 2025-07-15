import {Module} from "@nestjs/common";
import {WalkGateway} from "./walk.gateway";
import {DirController} from "./walk.controller";


@Module({
  imports: [],
  controllers: [
    DirController
  ],
  providers: [
    WalkGateway
  ],
  exports: [
    WalkGateway
  ]
})
export class WalkModule {
}

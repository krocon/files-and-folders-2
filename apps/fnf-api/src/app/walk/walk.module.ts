import {Module} from "@nestjs/common";
import {WalkGateway} from "./walk.gateway";


@Module({
  imports: [],
  controllers: [],
  providers: [
    WalkGateway
  ],
  exports: [
    WalkGateway
  ]
})
export class WalkModule {
}

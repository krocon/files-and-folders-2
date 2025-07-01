import {Module} from "@nestjs/common";
import {VolumeGateway} from "./volume.gateway";


@Module({
  imports: [],
  controllers: [],
  providers: [
    VolumeGateway
  ],
  exports: [
    VolumeGateway
  ]
})
export class VolumeModule {
}

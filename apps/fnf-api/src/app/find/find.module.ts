import {Module} from "@nestjs/common";
import {FindGateway} from "./find.gateway";


@Module({
  imports: [],
  controllers: [],
  providers: [
    FindGateway
  ],
  exports: [
    FindGateway
  ]
})
export class FindModule {
}

import {Module} from "@nestjs/common";
import {CustomCssGateway} from "./custom-css.gateway";


@Module({
  imports: [],
  controllers: [],
  providers: [
    CustomCssGateway
  ],
  exports: [
    CustomCssGateway
  ]
})
export class CustomCssModule {
}

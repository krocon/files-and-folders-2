import {Module} from "@nestjs/common";
import {FileService} from "./file.service";
import {FileActionController} from "./file-action.constroller";
import {FileActionGateway} from "./file-action.gateway";

@Module({
  imports: [],
  controllers: [
    FileActionController
  ],
  providers: [
    FileService,
    FileActionGateway
  ],
  exports: [
    FileActionGateway
  ]
})
export class FileActionModule {
}

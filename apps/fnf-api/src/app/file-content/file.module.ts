import {Module} from "@nestjs/common";
import {FileController} from "./file.constroller";

@Module({
  imports: [],
  controllers: [FileController],
  providers: []
})
export class FileModule {
}

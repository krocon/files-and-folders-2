import {Module} from "@nestjs/common";
import {ServeStaticModule} from "@nestjs/serve-static";

import {join} from "path";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {SysinfoModule} from "./sysinfo/sysinfo.module";
import {DrivesModule} from "./drives/drives.module";
import {FileModule} from "./file-content/file.module";
import {FileActionModule} from "./file-action/file-action.module";
import {WalkModule} from "./walk/walk.module";
import {DirModule} from "./dir/dir.module";
import {CustomCssModule} from "./customcss/custom-css.module";
import {ConfigModule} from "./config/config.module";
import {FindModule} from "./find/find.module";
import {Config} from "@fnf/fnf-data";
import {FindFolderModule} from "./findfolder/find-folder.module";
import {CmdModule} from "./cmd/cmd.module";
import {VolumeModule} from "./volumes/volume.module";
import {FilenameModule} from "./filename/filename.module";

const config = new Config(
  process.env.FNF_INCOMPATIBLE_PATHS ? process.env.FNF_INCOMPATIBLE_PATHS.split(",") : [],
  process.env.FNF_CONTAINER_PATHS ? process.env.FNF_CONTAINER_PATHS.split(",") : [],
  process.env.FNF_START_PATH ? process.env.FNF_START_PATH :
  process.env.FNF_CONTAINER_PATHS ? process.env.FNF_CONTAINER_PATHS.split(",")[0] : '/',
  process.env.FNF_DOCKER_ROOT ? process.env.FNF_DOCKER_ROOT : undefined,
);

@Module({
  imports: [
    SysinfoModule,
    ConfigModule.forRoot(
      config
    ),
    DrivesModule.forRoot(
      config
    ),
    FileModule,
    FileActionModule,
    WalkModule,
    VolumeModule,
    FindModule,
    CmdModule,
    FindFolderModule.forRoot(
      config
    ),
    DirModule.forRoot(
      config
    ),
    CustomCssModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "fnf")
    }),
    FilenameModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ]
})
export class AppModule {}

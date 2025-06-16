import {Module} from "@nestjs/common";
import {SysinfoController} from "./sysinfo.controller";
import {SysinfoService} from "./sysinfo.service";


@Module({
  imports: [],
  controllers: [SysinfoController],
  providers: [SysinfoService]
})
export class SysinfoModule {

  // evtl. analog und Partial<EnvIf>
  // public static forRoot(restrictedPaths: string[] | undefined): DynamicModule {
  //   if (restrictedPaths) {
  //     DrivesService.restrictedPaths = restrictedPaths;
  //     Logger.log("DrivesService.restrictedPaths -> " + DrivesService.restrictedPaths);
  //   }
  //   return {
  //     module: DrivesModule,
  //     providers: [
  //       DrivesService
  //     ]
  //   };
  // }

}

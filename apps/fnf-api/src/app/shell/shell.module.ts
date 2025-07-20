import {Module} from "@nestjs/common";
import {ShellController} from "./shell.controller";
import {ShellAutocompleteController} from "./shell-autocomplete.controller";
import {ShellCommandsWindows} from "./shell-commands-windows";
import {ShellCommandsLinux} from "./shell-commands-linux";
import {ShellCommandsMacOS} from "./shell-commands-macos";
import {ShellGateway} from "./shell.gateway";

@Module({
  exports: [
    ShellGateway
  ],
  controllers: [
    ShellController,
    ShellAutocompleteController
  ],
  providers: [
    ShellCommandsWindows,
    ShellCommandsLinux,
    ShellCommandsMacOS,
    ShellGateway
  ]
})
export class ShellModule {
}

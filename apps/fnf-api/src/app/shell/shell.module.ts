import {Module} from "@nestjs/common";
import {ShellController} from "./shell.controller";
import {ShellAutocompleteController} from "./shell-autocomplete.controller";
import {ShellCommandsWindows} from "./shell-commands-windows";
import {ShellCommandsLinux} from "./shell-commands-linux";
import {ShellCommandsMacOS} from "./shell-commands-macos";

@Module({
  imports: [],
  controllers: [
    ShellController,
    ShellAutocompleteController
  ],
  providers: [
    ShellCommandsWindows,
    ShellCommandsLinux,
    ShellCommandsMacOS
  ]
})
export class ShellModule {
}

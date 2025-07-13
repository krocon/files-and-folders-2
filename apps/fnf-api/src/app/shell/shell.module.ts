import {Module} from "@nestjs/common";
import {ShellController} from "./shell.controller";
import {ShellAutocompleteController} from "./shell-autocomplete.controller";


@Module({
  imports: [],
  controllers: [
    ShellController,
    ShellAutocompleteController
  ]
})
export class ShellModule {
}

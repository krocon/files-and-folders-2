import {Controller, Get, Query} from '@nestjs/common';
import {platform} from 'os';
import {ShellCommandsWindows} from './shell-commands-windows';
import {ShellCommandsLinux} from './shell-commands-linux';
import {ShellCommandsMacOS} from './shell-commands-macos';

@Controller('shell-autocomplete')
export class ShellAutocompleteController {
  constructor(
    private readonly windowsCommandsService: ShellCommandsWindows,
    private readonly linuxCommandsService: ShellCommandsLinux,
    private readonly macosCommandsService: ShellCommandsMacOS
  ) {
  }

  @Get()
  async getAutocompleteSuggestions(@Query('input') input: string): Promise<string[]> {
    if (!input) {
      return [];
    }

    const os = this.detectOS();
    const commands = await this.getCommandsForOS(os);
    const commandsWithParams = await this.getCommandsWithParamsForOS(os);

    // Filter commands and commands with parameters that start with the input (case insensitive)
    return commandsWithParams.filter(cmd =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );
  }

  private detectOS(): 'windows' | 'linux' | 'macos' {
    const currentPlatform = platform();

    if (currentPlatform === 'win32') {
      return 'windows';
    } else if (currentPlatform === 'darwin') {
      return 'macos';
    } else {
      return 'linux';
    }
  }

  private async getCommandsForOS(os: 'windows' | 'linux' | 'macos'): Promise<string[]> {
    switch (os) {
      case 'windows':
        return this.windowsCommandsService.getCommands();
      case 'linux':
        return this.linuxCommandsService.getCommands();
      case 'macos':
        return this.macosCommandsService.getCommands();
      default:
        return [];
    }
  }

  private async getCommandsWithParamsForOS(os: 'windows' | 'linux' | 'macos'): Promise<string[]> {
    switch (os) {
      case 'windows':
        return this.windowsCommandsService.getCommandsWithParams();
      case 'linux':
        return this.linuxCommandsService.getCommandsWithParams();
      case 'macos':
        return this.macosCommandsService.getCommandsWithParams();
      default:
        return [];
    }
  }
}

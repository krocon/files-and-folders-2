import {Controller, Get, Query} from '@nestjs/common';
import {platform} from 'os';

@Controller('shell-autocomplete')
export class ShellAutocompleteController {

  private windowsCommands = [
    'cd', 'dir', 'copy', 'del', 'mkdir', 'rmdir', 'type', 'echo', 'cls',
    'findstr', 'tasklist', 'taskkill', 'ipconfig', 'ping', 'netstat',
    'systeminfo', 'sfc', 'chkdsk', 'powershell', 'cmd', 'start',
    'shutdown', 'restart', 'attrib', 'xcopy', 'move', 'ren', 'set',
    'path', 'ver', 'date', 'time', 'help', 'exit'
  ];

  private linuxCommands = [
    'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
    'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
    'ifconfig', 'ip', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
    'apt', 'apt-get', 'yum', 'dnf', 'systemctl', 'service', 'sudo',
    'su', 'man', 'less', 'more', 'head', 'tail', 'touch', 'echo',
    'pwd', 'whoami', 'uname', 'date', 'history', 'clear', 'exit'
  ];

  private macosCommands = [
    'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
    'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
    'ifconfig', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
    'brew', 'sudo', 'su', 'man', 'less', 'more', 'head', 'tail', 'touch',
    'echo', 'pwd', 'whoami', 'uname', 'date', 'history', 'clear',
    'open', 'pbcopy', 'pbpaste', 'defaults', 'diskutil', 'launchctl',
    'softwareupdate', 'airport', 'xcode-select', 'exit'
  ];

  @Get()
  async getAutocompleteSuggestions(@Query('input') input: string): Promise<string[]> {
    if (!input) {
      return [];
    }

    const os = this.detectOS();
    const commands = this.getCommandsForOS(os);

    // Filter commands that start with the input (case insensitive)
    return commands.filter(cmd =>
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

  private getCommandsForOS(os: 'windows' | 'linux' | 'macos'): string[] {
    switch (os) {
      case 'windows':
        return this.windowsCommands;
      case 'linux':
        return this.linuxCommands;
      case 'macos':
        return this.macosCommands;
      default:
        return [];
    }
  }
}
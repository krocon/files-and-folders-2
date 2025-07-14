import {Injectable} from '@nestjs/common';

@Injectable()
export class ShellCommandsWindows {
  private commands = [
    'cd', 'dir', 'copy', 'del', 'mkdir', 'rmdir', 'type', 'echo', 'cls',
    'findstr', 'tasklist', 'taskkill', 'ipconfig', 'ping', 'netstat',
    'systeminfo', 'sfc', 'chkdsk', 'powershell', 'cmd', 'start',
    'shutdown', 'restart', 'attrib', 'xcopy', 'move', 'ren', 'set',
    'path', 'ver', 'date', 'time', 'help', 'exit'
  ];

  private commandsWithParams = [
    'cd', 'cd ..', 'cd /',
    'dir', 'dir /a', 'dir /w',
    'copy',
    'del',
    'mkdir',
    'rmdir',
    'type',
    'echo',
    'cls',
    'findstr',
    'tasklist',
    'taskkill', 'taskkill /im', 'taskkill /pid',
    'ipconfig', 'ipconfig /all',
    'ping',
    'netstat', 'netstat -a',
    'systeminfo',
    'sfc', 'sfc /scannow',
    'chkdsk', 'chkdsk /f',
    'powershell',
    'cmd',
    'start',
    'shutdown', 'shutdown /s', 'shutdown /r',
    'restart',
    'attrib',
    'xcopy',
    'move',
    'ren',
    'set',
    'path',
    'ver',
    'date',
    'time',
    'help',
    'exit'
  ];

  getCommands(): string[] {
    return this.commands;
  }

  getCommandsWithParams(): string[] {
    return this.commandsWithParams;
  }
}
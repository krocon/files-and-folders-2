import {Test, TestingModule} from '@nestjs/testing';
import * as os from 'os';
import {ShellCommandsMacOS} from "./shell-commands-macos";
import {ShellAutocompleteController} from "./shell-autocomplete.controller";
import {ShellCommandsWindows} from "./shell-commands-windows";
import {ShellCommandsLinux} from "./shell-commands-linux";

// Mock the os.platform function
jest.mock('os', () => ({
  platform: jest.fn()
}));

describe('ShellAutocompleteController', () => {
  let controller: ShellAutocompleteController;
  let windowsCommandsService: Partial<ShellCommandsWindows>;
  let linuxCommandsService: Partial<ShellCommandsLinux>;
  let macosCommandsService: Partial<ShellCommandsMacOS>;

  beforeEach(async () => {
    // Create mock implementations
    windowsCommandsService = {
      getCommands: jest.fn().mockReturnValue([
        'cd', 'dir', 'copy', 'del', 'mkdir', 'rmdir', 'type', 'echo', 'cls',
        'findstr', 'tasklist', 'taskkill', 'ipconfig', 'ping', 'netstat',
        'systeminfo', 'sfc', 'chkdsk', 'powershell', 'cmd', 'start',
        'shutdown', 'restart', 'attrib', 'xcopy', 'move', 'ren', 'set',
        'path', 'ver', 'date', 'time', 'help', 'exit'
      ]),
      getCommandsWithParams: jest.fn().mockReturnValue([
        'cd', 'cd ..', 'cd /', 'dir', 'dir /a', 'dir /w', 'copy', 'del',
        'mkdir', 'rmdir', 'type', 'echo', 'cls', 'findstr', 'tasklist',
        'taskkill', 'taskkill /im', 'taskkill /pid', 'ipconfig', 'ipconfig /all',
        'ping', 'netstat', 'netstat -a', 'systeminfo', 'sfc', 'sfc /scannow',
        'chkdsk', 'chkdsk /f', 'powershell', 'cmd', 'start', 'shutdown',
        'shutdown /s', 'shutdown /r', 'restart', 'attrib', 'xcopy', 'move',
        'ren', 'set', 'path', 'ver', 'date', 'time', 'help', 'exit'
      ])
    };

    linuxCommandsService = {
      getCommands: jest.fn().mockReturnValue([
        'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
        'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
        'ifconfig', 'ip', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
        'apt', 'apt-get', 'yum', 'dnf', 'systemctl', 'service', 'sudo',
        'su', 'man', 'less', 'more', 'head', 'tail', 'touch', 'echo',
        'pwd', 'whoami', 'uname', 'date', 'history', 'clear', 'exit'
      ]),
      getCommandsWithParams: jest.fn().mockReturnValue([
        'ls', 'ls -l', 'ls -a', 'ls -la', 'ls -al', 'ls -h',
        'cd', 'cd ..', 'cd ~', 'cp', 'cp -r', 'mv', 'rm', 'rm -r', 'rm -f',
        'rm -rf', 'mkdir', 'mkdir -p', 'rmdir', 'cat', 'grep', 'grep -i',
        'grep -r', 'find', 'find . -name', 'chmod', 'chmod +x', 'chmod 755',
        'chmod 644', 'chown', 'ps', 'ps aux', 'kill', 'kill -9', 'top',
        'df', 'df -h', 'du', 'du -h', 'du -sh', 'free', 'free -h',
        'ifconfig', 'ip', 'ip addr', 'ping', 'ssh', 'scp', 'tar', 'tar -xvf',
        'tar -cvf', 'gzip', 'gunzip', 'apt', 'apt update', 'apt upgrade',
        'apt install', 'apt-get', 'apt-get update', 'apt-get upgrade',
        'apt-get install', 'yum', 'yum update', 'yum install', 'dnf',
        'dnf update', 'dnf install', 'systemctl', 'systemctl start',
        'systemctl stop', 'systemctl status', 'service', 'service start',
        'service stop', 'service status', 'sudo', 'su', 'man', 'less',
        'more', 'head', 'tail', 'tail -f', 'touch', 'echo', 'pwd',
        'whoami', 'uname', 'uname -a', 'date', 'history', 'clear', 'exit'
      ])
    };

    macosCommandsService = {
      getCommands: jest.fn().mockResolvedValue([
        'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
        'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
        'ifconfig', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
        'brew', 'sudo', 'su', 'man', 'less', 'more', 'head', 'tail', 'touch',
        'echo', 'pwd', 'whoami', 'uname', 'date', 'history', 'clear',
        'open', 'pbcopy', 'pbpaste', 'defaults', 'diskutil', 'launchctl',
        'softwareupdate', 'airport', 'xcode-select', 'exit'
      ]),
      getCommandsWithParams: jest.fn().mockReturnValue([
        'ls', 'ls -l', 'ls -a', 'ls -la', 'ls -al', 'ls -h',
        'cd', 'cd ..', 'cd ~', 'cp', 'cp -r', 'mv', 'rm', 'rm -r', 'rm -f',
        'rm -rf', 'mkdir', 'mkdir -p', 'rmdir', 'cat', 'grep', 'grep -i',
        'grep -r', 'find', 'find . -name', 'chmod', 'chmod +x', 'chmod 755',
        'chmod 644', 'chown', 'ps', 'ps aux', 'kill', 'kill -9', 'top',
        'df', 'df -h', 'du', 'du -h', 'du -sh', 'ifconfig', 'ping', 'ssh',
        'scp', 'tar', 'tar -xvf', 'tar -cvf', 'gzip', 'gunzip', 'brew',
        'brew install', 'brew update', 'brew upgrade', 'sudo', 'su', 'man',
        'less', 'more', 'head', 'tail', 'tail -f', 'touch', 'echo', 'pwd',
        'whoami', 'uname', 'uname -a', 'date', 'history', 'clear', 'open',
        'pbcopy', 'pbpaste', 'defaults', 'diskutil', 'diskutil list',
        'launchctl', 'softwareupdate', 'softwareupdate -l', 'xcode-select',
        'xcode-select --install', 'exit'
      ])
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShellAutocompleteController],
      providers: [
        {provide: ShellCommandsWindows, useValue: windowsCommandsService},
        {provide: ShellCommandsLinux, useValue: linuxCommandsService},
        {provide: ShellCommandsMacOS, useValue: macosCommandsService},
      ],
    }).compile();

    controller = module.get<ShellAutocompleteController>(ShellAutocompleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return empty array for empty input', async () => {
    const result = await controller.getAutocompleteSuggestions('');
    expect(result).toEqual([]);
  });

  describe('Windows OS', () => {
    beforeEach(() => {
      // Mock platform to return 'win32' for Windows
      (os.platform as jest.Mock).mockReturnValue('win32');
    });

    it('should return Windows commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('dir');
      expect(result).toContain('dir');
      expect(result).not.toContain('ls');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('DIR');
      expect(result).toContain('dir');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('d');
      expect(result).toContain('dir');
      expect(result).toContain('date');
      expect(result).toContain('del');
    });

    it('should include commands with parameters', async () => {
      const result = await controller.getAutocompleteSuggestions('dir');
      expect(result).toContain('dir');
      expect(result).toContain('dir /a');
      expect(result).toContain('dir /w');
    });

    it('should filter commands with parameters correctly', async () => {
      const result = await controller.getAutocompleteSuggestions('dir /');
      expect(result).toContain('dir /a');
      expect(result).toContain('dir /w');
      expect(result).not.toContain('cd');
    });
  });

  describe('Linux OS', () => {
    beforeEach(() => {
      // Mock platform to return 'linux'
      (os.platform as jest.Mock).mockReturnValue('linux');
    });

    it('should return Linux commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('ls');
      expect(result).toContain('ls');
      expect(result).not.toContain('dir');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('LS');
      expect(result).toContain('ls');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('c');
      expect(result).toContain('cd');
      expect(result).toContain('cp');
      expect(result).toContain('chmod');
    });

    it('should include commands with parameters', async () => {
      const result = await controller.getAutocompleteSuggestions('ls');
      expect(result).toContain('ls');
      expect(result).toContain('ls -l');
      expect(result).toContain('ls -a');
      expect(result).toContain('ls -la');
    });

    it('should filter commands with parameters correctly', async () => {
      const result = await controller.getAutocompleteSuggestions('ls -');
      expect(result).toContain('ls -l');
      expect(result).toContain('ls -a');
      expect(result).toContain('ls -la');
      expect(result).not.toContain('cd');
    });
  });

  describe('macOS', () => {
    beforeEach(() => {
      // Mock platform to return 'darwin' for macOS
      (os.platform as jest.Mock).mockReturnValue('darwin');
    });

    it('should return macOS commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('pb');
      expect(result).toContain('pbcopy');
      expect(result).toContain('pbpaste');
      expect(result).not.toContain('dir');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('OPEN');
      expect(result).toContain('open');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('p');
      expect(result).toContain('ps');
      expect(result).toContain('ping');
      expect(result).toContain('pwd');
    });

    it('should include commands with parameters', async () => {
      const result = await controller.getAutocompleteSuggestions('brew');
      expect(result).toContain('brew');
      expect(result).toContain('brew install');
      expect(result).toContain('brew update');
      expect(result).toContain('brew upgrade');
    });

    it('should filter commands with parameters correctly', async () => {
      const result = await controller.getAutocompleteSuggestions('brew i');
      expect(result).toContain('brew install');
      expect(result).not.toContain('brew update');
      expect(result).not.toContain('ls');
    });

    it('should handle dynamically fetched commands', async () => {
      // This test verifies that the controller can handle the async nature of the macOS commands service
      const result = await controller.getAutocompleteSuggestions('l');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

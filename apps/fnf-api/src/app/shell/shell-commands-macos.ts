import {Injectable} from '@nestjs/common';
import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

@Injectable()
export class ShellCommandsMacOS {
  // Fallback commands in case dynamic fetching fails
  private fallbackCommands = [
    'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
    'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
    'ifconfig', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
    'brew', 'sudo', 'su', 'man', 'less', 'more', 'head', 'tail', 'touch',
    'echo', 'pwd', 'whoami', 'uname', 'date', 'history', 'clear',
    'open', 'pbcopy', 'pbpaste', 'defaults', 'diskutil', 'launchctl',
    'softwareupdate', 'airport', 'xcode-select', 'exit'
  ];

  private commandsWithParams = [
    'ls', 'ls -l', 'ls -a', 'ls -la', 'ls -al', 'ls -h',
    'cd', 'cd ..', 'cd ~',
    'cp', 'cp -r',
    'mv',
    'rm', 'rm -r', 'rm -f', 'rm -rf',
    'mkdir', 'mkdir -p',
    'rmdir',
    'cat',
    'grep', 'grep -i', 'grep -r',
    'find', 'find . -name',
    'chmod', 'chmod +x', 'chmod 755', 'chmod 644',
    'chown',
    'ps', 'ps aux',
    'kill', 'kill -9',
    'top',
    'df', 'df -h',
    'du', 'du -h', 'du -sh',
    'ifconfig',
    'ping',
    'ssh',
    'scp',
    'tar', 'tar -xvf', 'tar -cvf',
    'gzip',
    'gunzip',
    'brew', 'brew install', 'brew update', 'brew upgrade',
    'sudo',
    'su',
    'man',
    'less',
    'more',
    'head',
    'tail', 'tail -f',
    'touch',
    'echo',
    'pwd',
    'whoami',
    'uname', 'uname -a',
    'date',
    'history',
    'clear',
    'open',
    'pbcopy',
    'pbpaste',
    'defaults',
    'diskutil', 'diskutil list',
    'launchctl',
    'softwareupdate', 'softwareupdate -l',
    'xcode-select', 'xcode-select --install',
    'exit'
  ];

  private cachedCommands: string[] | null = null;

  async getCommands(): Promise<string[]> {
    if (this.cachedCommands) {
      return this.cachedCommands;
    }

    try {
      // Try to get commands dynamically
      const {stdout} = await execAsync('ls -1 $(echo $PATH | tr ":" " ") 2>/dev/null | sort -u');
      const dynamicCommands = stdout.split('\n')
        .filter(cmd => cmd.trim() !== '')
        .map(cmd => cmd.trim());

      this.cachedCommands = dynamicCommands;
      return dynamicCommands;
    } catch (error) {
      console.error('Failed to fetch macOS commands dynamically:', error);
      // Return fallback commands if dynamic fetching fails
      return this.fallbackCommands;
    }
  }

  getCommandsWithParams(): string[] {
    return this.commandsWithParams;
  }
}
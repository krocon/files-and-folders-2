import {Injectable} from '@nestjs/common';

@Injectable()
export class ShellCommandsLinux {
  private commands = [
    'ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'cat', 'grep',
    'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'free',
    'ifconfig', 'ip', 'ping', 'ssh', 'scp', 'tar', 'gzip', 'gunzip',
    'apt', 'apt-get', 'yum', 'dnf', 'systemctl', 'service', 'sudo',
    'su', 'man', 'less', 'more', 'head', 'tail', 'touch', 'echo',
    'pwd', 'whoami', 'uname', 'date', 'history', 'clear', 'exit'
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
    'free', 'free -h',
    'ifconfig',
    'ip', 'ip addr',
    'ping',
    'ssh',
    'scp',
    'tar', 'tar -xvf', 'tar -cvf',
    'gzip',
    'gunzip',
    'apt', 'apt update', 'apt upgrade', 'apt install',
    'apt-get', 'apt-get update', 'apt-get upgrade', 'apt-get install',
    'yum', 'yum update', 'yum install',
    'dnf', 'dnf update', 'dnf install',
    'systemctl', 'systemctl start', 'systemctl stop', 'systemctl status',
    'service', 'service start', 'service stop', 'service status',
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
    'exit'
  ];

  getCommands(): string[] {
    return this.commands;
  }

  getCommandsWithParams(): string[] {
    return this.commandsWithParams;
  }
}
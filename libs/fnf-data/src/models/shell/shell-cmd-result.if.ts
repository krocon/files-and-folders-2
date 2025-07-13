import {ShellCmdIf} from "./shell-cmd.if";

export interface ShellCmdResultIf extends ShellCmdIf {

  cmd: string;
  para: string;

  stdout?: string;
  stderr?: string;
  error?: string;

}

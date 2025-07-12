import {ShellCmdIf} from "./shell-cmd.if";


export interface CmdIf extends ShellCmdIf {

  id: string;
  label: string;
  shortcut: string;
  cmd: string;
  fileLimit?: number;
  para: string;
  local: boolean;

}
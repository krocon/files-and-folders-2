import {ExecException} from "child_process";
import {SysinfoIf} from "@fnf/fnf-data";

export type SysInfoCallbackFn = (
  eror: ExecException,
  sysinfo: SysinfoIf
) => void;

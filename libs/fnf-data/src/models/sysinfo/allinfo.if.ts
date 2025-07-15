import {SysinfoIf} from "@fnf/fnf-data";

export interface AllinfoIf {
  sysinfo?: SysinfoIf;
  env: { [key: string]: string[] };

}

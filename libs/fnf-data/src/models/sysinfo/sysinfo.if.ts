export interface SysinfoIf {
  type: string;
  platform: string;
  arch: string;
  linux: boolean;
  osx: boolean;
  windows: boolean;
  smartMachine: boolean;
  docker: boolean;
  hostname: string;
  username: string;
  homedir: string;
  tmpdir: string;
}

export interface ShellSpawnParaIf {
  cmd: string;
  emitKey: string;
  cancelKey: string;
  timeout: number; // in milliseconds, e.g., 60000
  cols?: number; // terminal columns for screen size
  rows?: number; // terminal rows for screen size
  dir?: string; // working directory for the shell command
}

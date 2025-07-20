export interface ShellSpawnParaIf {
  cmd: string;
  emitKey: string;
  cancelKey: string;
  timeout: number; // in milliseconds, e.g., 60000
}
export interface ShellSpawnResultIf {
  emitKey: string;
  out: string;
  error: string;
  code: number | null;
  done: boolean;
}
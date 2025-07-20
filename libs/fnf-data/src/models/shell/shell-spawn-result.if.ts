export interface ShellSpawnResultIf {
  out: string;
  error: string;
  code: number | null;
  done: boolean;
}
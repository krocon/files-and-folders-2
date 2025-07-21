export interface ShellSpawnResultIf {
  emitKey: string;
  out: string;
  error: string;
  code: number | null;
  done: boolean;
  hasAnsiEscapes?: boolean; // indicates if output contains ANSI color/formatting codes
  pid?: number; // process ID
  currentDir?: string; // current working directory after command execution
}

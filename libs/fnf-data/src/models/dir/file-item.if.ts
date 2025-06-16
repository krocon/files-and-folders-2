export interface FileItemIf {
  dir: string;
  base: string;
  ext: string;
  size: number;
  date: string;
  isDir: boolean;
  abs: boolean;
  error?: string;
  status?: string;

  selected?: boolean;
}

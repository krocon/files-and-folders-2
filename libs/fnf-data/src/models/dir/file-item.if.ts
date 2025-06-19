import {FileItemMetaIf} from "./file-item-meta.if";

export interface FileItemIf {
  dir: string;
  base: string;
  ext: string;
  size: number;
  date: string;
  isDir: boolean;
  abs: boolean;

  meta?: FileItemMetaIf;
}

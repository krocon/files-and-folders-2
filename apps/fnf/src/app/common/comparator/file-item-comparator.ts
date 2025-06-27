import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";


export function fileItemComparator(value1: FileItemIf, value2: FileItemIf, row1?: any, row2?: any, f?: number): number {

  if (f === undefined || f === null) f = 1;

  if (!value1) return 1;
  if (!value2) return -1;

  if (value1.base === DOT_DOT) return -1000 * f;
  if (value2.base === DOT_DOT) return 1000 * f;

  // Regardless of the sort order (ascending or descending), we always want directories to be displayed at the top:
  if (value1.isDir && !value2.isDir) return -10 * f;
  if (!value1.isDir && value2.isDir) return 10 * f;

  return (value1.dir+value1.base).toUpperCase().localeCompare((value2.dir+value2.base).toUpperCase());
}


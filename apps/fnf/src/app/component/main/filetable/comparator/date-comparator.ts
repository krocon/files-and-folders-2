import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";


export function dateComparator(value1: number, value2: number, row1?: FileItemIf, row2?: FileItemIf, f?: number): number {

  if (f === undefined || f === null) f = 1;

  if (!row1) return 1;
  if (!row2) return -1;

  if (row1.base === DOT_DOT) return -1000 * f;
  if (row2.base === DOT_DOT) return 1000 * f;

  // Regardless of the sort order (ascending or descending), we always want directories to be displayed at the top:
  if (row1.isDir && !row2.isDir) return -10 * f;
  if (!row1.isDir && row2.isDir) return 10 * f;


  return row1.date.localeCompare(row2.date);
}

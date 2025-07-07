import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";


export function fileItemSorter(row1: FileItemIf, row2: FileItemIf, f: number = 1) {

  if (!row1) return 1;
  if (!row2) return -1;

  if (row1.base === DOT_DOT) return -1000 * f;
  if (row2.base === DOT_DOT) return 1000 * f;

  // Regardless of the sort order (ascending or descending), we always want directories to be displayed at the top:
  if (row1.isDir && !row2.isDir) return -10 * f;
  if (!row1.isDir && row2.isDir) return 10 * f;

  return row1.base.toUpperCase().localeCompare(row2.base.toUpperCase());
}
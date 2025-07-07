import {FileItemIf} from "@fnf/fnf-data";
import {fileItemSorter} from "../../../../common/fn/file-item-sorter.fn";


export function fileNameComparator(value1: string, value2: string, row1: FileItemIf, row2: FileItemIf, f?: number): number {

  if (f === undefined || f === null) f = 1;

  return fileItemSorter(row1, row2);
}

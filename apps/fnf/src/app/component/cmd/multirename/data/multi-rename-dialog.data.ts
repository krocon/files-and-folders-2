import {FileItemIf} from "@fnf/fnf-data";
import {Options} from "./options";
import {MultiRenameData} from "./multi-rename.data";
import {MultiRenameOptions} from "./multi-rename-options";


export class MultiRenameDialogData {

  data = new MultiRenameData();
  options: Options = new MultiRenameOptions();

  constructor(
    public rows: FileItemIf[] = [],
  ) {
  }
}

import {FileItemIf, PanelIndex} from "@fnf/fnf-data";
import {Options} from "./options";
import {MultiRenameData} from "./multi-rename.data";
import {MultiRenameOptions} from "./multi-rename-options";


export class MultiRenameDialogData {

  data:MultiRenameData|null = null;
  options: Options = new MultiRenameOptions();

  constructor(
    public rows: FileItemIf[] = [],
    public panelIndex: PanelIndex = 0
  ) {
  }
}

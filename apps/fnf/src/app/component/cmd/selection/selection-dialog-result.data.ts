import {FileItemIf} from "@fnf/fnf-data";

export class SelectionDialogResultData {

  constructor(
    public source: FileItemIf,
    public target: FileItemIf,
  ) {
  }
}

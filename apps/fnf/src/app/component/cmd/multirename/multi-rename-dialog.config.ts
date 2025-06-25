import {MatDialogConfig} from "@angular/material/dialog";
import {MultiRenameDialogData} from "./multi-rename-dialog.data";

export class MultiRenameDialogConfig extends MatDialogConfig {

  public override data: MultiRenameDialogData = new MultiRenameDialogData();

  constructor(data: MultiRenameDialogData) {
    super();
    this.data = data;
    this.minHeight = 'calc(100vh - 200px)';
    this.minWidth = "calc(100vw - 200px)";
  }
}

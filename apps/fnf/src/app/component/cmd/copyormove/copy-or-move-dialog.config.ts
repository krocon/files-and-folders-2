import {MatDialogConfig} from "@angular/material/dialog";
import {CopyOrMoveDialogData} from "./copy-or-move-dialog.data";

export class CopyOrMoveDialogConfig extends MatDialogConfig {

  public override data: CopyOrMoveDialogData = new CopyOrMoveDialogData();

  constructor(data: CopyOrMoveDialogData) {
    super();
    this.data = data;
    this.minHeight = 200;
    this.minWidth = "700px";
  }
}

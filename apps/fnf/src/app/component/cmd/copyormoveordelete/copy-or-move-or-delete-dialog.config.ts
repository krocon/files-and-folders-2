import {MatDialogConfig} from "@angular/material/dialog";
import {CopyOrMoveOrDeleteDialogData} from "./copy-or-move-or-delete-dialog.data";

export class CopyOrMoveOrDeleteDialogConfig extends MatDialogConfig {

  public override data: CopyOrMoveOrDeleteDialogData = new CopyOrMoveOrDeleteDialogData();

  constructor(data: CopyOrMoveOrDeleteDialogData) {
    super();
    this.data = data;
    this.minHeight = 200;
    this.minWidth = "700px";
  }
}

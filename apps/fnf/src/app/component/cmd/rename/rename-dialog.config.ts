import {MatDialogConfig} from "@angular/material/dialog";
import {RenameDialogData} from "./rename-dialog.data";

export class RenameDialogConfig extends MatDialogConfig {


  constructor(public override data: RenameDialogData) {
    super();
    this.minHeight = 200;
    this.minWidth = "700px";
  }
}

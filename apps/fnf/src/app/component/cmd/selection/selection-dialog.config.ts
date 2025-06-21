import {MatDialogConfig} from "@angular/material/dialog";
import {SelectionDialogData} from "./selection-dialog.data";

export class SelectionDialogConfig extends MatDialogConfig {


  constructor(public override data: SelectionDialogData) {
    super();
    this.minHeight = 100;
    this.minWidth = "700px";
  }
}

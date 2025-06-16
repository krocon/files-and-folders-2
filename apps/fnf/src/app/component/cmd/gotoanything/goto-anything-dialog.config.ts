import {MatDialogConfig} from "@angular/material/dialog";
import {GotoAnythingDialogData} from "./goto-anything-dialog.data";

export class GotoAnythingDialogConfig extends MatDialogConfig {

  public override data: GotoAnythingDialogData = new GotoAnythingDialogData();

  constructor(data: GotoAnythingDialogData) {
    super();
    this.data = data;
    this.minHeight = 100;
    this.minWidth = "700px";
  }
}

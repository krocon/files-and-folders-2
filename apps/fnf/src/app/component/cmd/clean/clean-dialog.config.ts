import {MatDialogConfig} from "@angular/material/dialog";
import {CleanDialogData} from "@fnf/fnf-data";


export class CleanDialogConfig extends MatDialogConfig {


  constructor(public override data: CleanDialogData) {
    super();
    this.minHeight = 200;
    this.minWidth = "800px";
    this.autoFocus = false;
  }
}

import {MatDialogConfig} from "@angular/material/dialog";
import {FindDialogData} from "@fnf/fnf-data";


export class CleanDialogConfig extends MatDialogConfig {


  constructor(public override data: FindDialogData) {
    super();
    this.minHeight = 200;
    this.minWidth = "700px";
    this.autoFocus = false;
  }
}

import {MatDialogConfig} from "@angular/material/dialog";
import {MkdirDialogData} from "./mkdir-dialog.data";

export class MkdirDialogConfig extends MatDialogConfig {


  constructor(public override data: MkdirDialogData) {
    super();
    this.minHeight = 200;
    this.minWidth = "700px";
  }
}

import {MatDialogConfig} from "@angular/material/dialog";
import {ChangeDirDialogData} from "./data/change-dir-dialog.data";

export class ChangeDirDialogConfig extends MatDialogConfig {

  public override data: ChangeDirDialogData = new ChangeDirDialogData();

  constructor(data: ChangeDirDialogData) {
    super();
    this.data = data;
    this.minHeight = 'calc(100vh - 20px)';
    this.minWidth = "calc(100vw - 200px)";
  }
}

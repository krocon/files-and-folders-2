import {MatDialogConfig} from "@angular/material/dialog";
import {GroupFilesDialogData} from "./data/group-files-dialog.data";

export class GroupFilesDialogConfig extends MatDialogConfig {

  public override data: GroupFilesDialogData = new GroupFilesDialogData();

  constructor(data: GroupFilesDialogData) {
    super();
    this.data = data;
    this.minHeight = 'calc(100vh - 20px)';
    this.minWidth = "calc(100vw - 200px)";
  }
}

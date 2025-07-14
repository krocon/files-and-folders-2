import {MatDialogConfig} from "@angular/material/dialog";

export class MultiMkDirDialogConfig extends MatDialogConfig {


  constructor() {
    super();
    this.minHeight = 'calc(100vh - 20px)';
    this.minWidth = "calc(100vw - 200px)";
  }
}

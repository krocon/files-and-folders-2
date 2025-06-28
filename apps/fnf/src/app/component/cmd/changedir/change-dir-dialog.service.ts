import {Injectable} from "@angular/core";
import {ChangeDirDialogData} from "./data/change-dir-dialog.data";
import {ChangeDirDialogComponent} from "./change-dir-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ChangeDirDialogConfig} from "./change-dir-dialog.config";
import {ChangeDirEvent} from "../../../service/change-dir-event";

@Injectable({
  providedIn: "root"
})
export class ChangeDirDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: ChangeDirDialogData, cb: (target: ChangeDirEvent | undefined) => void) {
    let alive = true;
    const config = new ChangeDirDialogConfig(data);

    return this.dialog
      .open<ChangeDirDialogComponent, ChangeDirDialogData, ChangeDirEvent | undefined>(ChangeDirDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

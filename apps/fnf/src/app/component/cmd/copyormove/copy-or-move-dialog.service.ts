import {Injectable} from "@angular/core";
import {CopyOrMoveDialogData} from "./copy-or-move-dialog.data";
import {CopyOrMoveDialogComponent} from "./copy-or-move-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {CopyOrMoveDialogConfig} from "./copy-or-move-dialog.config";
import {FileItem, FileItemIf} from "@fnf/fnf-data";

@Injectable({
  providedIn: "root"
})
export class CopyOrMoveDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: CopyOrMoveDialogData, cb: (target: FileItemIf | undefined) => void) {
    let alive = true;
    const config = new CopyOrMoveDialogConfig(data);

    return this.dialog
      .open<CopyOrMoveDialogComponent, CopyOrMoveDialogData, FileItem | undefined>(CopyOrMoveDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

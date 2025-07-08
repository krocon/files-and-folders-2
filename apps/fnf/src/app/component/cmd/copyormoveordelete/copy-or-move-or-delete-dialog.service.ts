import {Injectable} from "@angular/core";
import {CopyOrMoveOrDeleteDialogData} from "./copy-or-move-or-delete-dialog.data";
import {CopyOrMoveOrDeleteDialogComponent} from "./copy-or-move-or-delete-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {CopyOrMoveOrDeleteDialogConfig} from "./copy-or-move-or-delete-dialog.config";
import {FileItem, FileItemIf} from "@fnf/fnf-data";

@Injectable({
  providedIn: "root"
})
export class CopyOrMoveOrDeleteDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: CopyOrMoveOrDeleteDialogData, cb: (target: FileItemIf | undefined) => void) {
    let alive = true;
    const config = new CopyOrMoveOrDeleteDialogConfig(data);

    return this.dialog
      .open<CopyOrMoveOrDeleteDialogComponent, CopyOrMoveOrDeleteDialogData, FileItem | undefined>(CopyOrMoveOrDeleteDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

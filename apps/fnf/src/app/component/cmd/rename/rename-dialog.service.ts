import {Injectable} from "@angular/core";
import {RenameDialogData} from "./rename-dialog.data";
import {RenameDialogComponent} from "./rename-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {RenameDialogConfig} from "./rename-dialog.config";
import {RenameDialogResultData} from "./rename-dialog-result.data";

@Injectable({
  providedIn: "root"
})
export class RenameDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: RenameDialogData, cb: (result: RenameDialogResultData | undefined) => void) {
    let alive = true;
    const config = new RenameDialogConfig(data);

    return this.dialog
      .open<RenameDialogComponent, RenameDialogData, RenameDialogResultData | undefined>(RenameDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

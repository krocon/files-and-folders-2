import {Injectable} from "@angular/core";
import {SelectionDialogData} from "./selection-dialog.data";
import {SelectionDialogComponent} from "./selection-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {SelectionDialogConfig} from "./selection-dialog.config";
import {SelectionDialogResultData} from "./selection-dialog-result.data";

@Injectable({
  providedIn: "root"
})
export class SelectionDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: SelectionDialogData, cb: (result: string|undefined) => void) {
    let alive = true;
    const config = new SelectionDialogConfig(data);

    return this.dialog
      .open<SelectionDialogComponent, SelectionDialogData, string>(SelectionDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

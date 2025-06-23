import {Injectable} from "@angular/core";

import {FindDialogComponent} from "./find-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {FindDialogConfig} from "./find-dialog.config";
import {FindDialogData} from "@fnf/fnf-data";

@Injectable({
  providedIn: "root"
})
export class FindDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: FindDialogData, cb: (result: FindDialogData | undefined) => void) {
    let alive = true;
    const config = new FindDialogConfig(data);

    return this.dialog
      .open<FindDialogComponent, FindDialogData, FindDialogData | undefined>(FindDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

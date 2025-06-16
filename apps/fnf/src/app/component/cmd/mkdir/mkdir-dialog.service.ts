import {Injectable} from "@angular/core";
import {MkdirDialogData} from "./mkdir-dialog.data";
import {MkdirDialogComponent} from "./mkdir-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {MkdirDialogConfig} from "./mkdir-dialog.config";
import {MkdirDialogResultData} from "./mkdir-dialog-result.data";

@Injectable({
  providedIn: "root"
})
export class MkdirDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: MkdirDialogData, cb: (result: MkdirDialogResultData | undefined) => void) {
    let alive = true;
    const config = new MkdirDialogConfig(data);

    return this.dialog
      .open<MkdirDialogComponent, MkdirDialogData, MkdirDialogResultData | undefined>(MkdirDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MultiMkdirDialogComponent} from './multi-mkdir-dialog.component';
import {MultiMkdirDialogData} from './data/multi-mkdir-dialog.data';
import {takeWhile} from "rxjs/operators";
import {MultiMkDirDialogConfig} from "./multi-mkdir-dialog.config";

@Injectable({
  providedIn: 'root'
})
export class MultiMkdirDialogService {

  constructor(
    private readonly dialog: MatDialog
  ) {
  }


  openDialog(
    parentDir: string,
    name: string = "S[C]",
    cb: (result: string[] | undefined) => void
  ): void {

    let alive = true;

    this.dialog
      .open(MultiMkdirDialogComponent, {
        ...new MultiMkDirDialogConfig(),
        data: new MultiMkdirDialogData(parentDir, name)
      })
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }
}
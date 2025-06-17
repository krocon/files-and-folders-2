import {Injectable} from "@angular/core";
import {ShortcutDialogComponent} from "./shortcut-dialog.component";
import {MatDialog} from "@angular/material/dialog";


@Injectable({
  providedIn: "root"
})
export class ShortcutDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open() {
    let subscription = this.dialog
      .open<ShortcutDialogComponent>(ShortcutDialogComponent, {
        height: 'calc(100vH - 100px)',
        width: 'calc(100vW - 100px)',
        maxWidth:'850px'
      })
      .afterClosed()
      .subscribe(item => {
        subscription.unsubscribe();
      });
  }

}

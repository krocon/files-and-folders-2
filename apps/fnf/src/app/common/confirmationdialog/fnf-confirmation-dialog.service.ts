import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {FnfConfirmationDialogComponent} from "./fnf-confirmation-dialog.component";
import {takeWhile} from "rxjs/operators";
import {ConfirmationData} from "./data/confirmation.data";
import {ButtonData} from "./data/button.data";

@Injectable({
  providedIn: "root"
})
export class FnfConfirmationDialogService {


  constructor(public dialog: MatDialog) {
  }

  public confirm(data: ConfirmationData): Observable<string> {
    return this.dialog
      .open(FnfConfirmationDialogComponent, {
        height: data.height,
        width: data.width,
        data,
        disableClose: false
      })
      .afterClosed();
  }

  public showError(phrases: Array<string>): Observable<FnfConfirmationDialogComponent> {
    const title = "Error";
    const buttons: Array<ButtonData> = [new ButtonData("CANCEL", "Close", "warn")];
    const data: ConfirmationData = new ConfirmationData(title, phrases, buttons);
    data.cssClass = "fnf-color-red-1";
    return this.dialog
      .open(FnfConfirmationDialogComponent, {
        height: data.height,
        width: data.width,
        data,
        disableClose: false
      })
      .afterClosed();
  }

  public showInfo(phrases: Array<string>): Observable<FnfConfirmationDialogComponent> {
    const title = "Info";
    const buttons: Array<ButtonData> = [new ButtonData("CANCEL", "Close", "warn")];
    const data: ConfirmationData = new ConfirmationData(title, phrases, buttons);

    return this.dialog
      .open(FnfConfirmationDialogComponent, {
        height: data.height,
        width: data.width,
        data,
        disableClose: false
      })
      .afterClosed();
  }

  public simpleConfirm(question: string, labels: string[], cb: (b: boolean) => void) {
    let alive = true;

    const data = new ConfirmationData(
      "",
      [question],
      [new ButtonData("BTN-0", labels[0], "primary"), new ButtonData("BTN-1", labels[1], "")]
    );

    const dlg = this.dialog.open(FnfConfirmationDialogComponent, {
      height: data.height,
      width: data.width,
      data,
      disableClose: false
    });

    dlg
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(key => {
        alive = false;
        cb(key === "BTN-0");
      });

    return dlg;
  }
}

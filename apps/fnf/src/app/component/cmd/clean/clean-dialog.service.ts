import {Injectable} from "@angular/core";

import {CleanDialogComponent} from "./clean-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {CleanDialogConfig} from "./clean-dialog.config";
import {FindDialogData} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";

@Injectable({
  providedIn: "root"
})
export class CleanDialogService {

  private readonly innerService = new TypedDataService<string>("find-dlg-pattern", '');


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: FindDialogData, cb: (result: FindDialogData | undefined) => void) {
    let alive = true;
    data.pattern = this.innerService.getValue();
    const config = new CleanDialogConfig(data);

    return this.dialog
      .open<CleanDialogComponent, FindDialogData, FindDialogData | undefined>(CleanDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        if (item) {
          this.innerService.update(item.pattern);
        }
        cb(item);
      });
  }

}

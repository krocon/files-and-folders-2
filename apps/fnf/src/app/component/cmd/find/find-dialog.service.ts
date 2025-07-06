import {Injectable} from "@angular/core";

import {FindDialogComponent} from "./find-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {FindDialogConfig} from "./find-dialog.config";
import {FindDialogData} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";

@Injectable({
  providedIn: "root"
})
export class FindDialogService {

  private readonly innerService = new TypedDataService<string>("find-dlg-pattern", '');


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: FindDialogData, cb: (result: FindDialogData | undefined) => void) {
    let alive = true;
    data.pattern = this.innerService.getValue();
    const config = new FindDialogConfig(data);

    return this.dialog
      .open<FindDialogComponent, FindDialogData, FindDialogData | undefined>(FindDialogComponent, config)
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

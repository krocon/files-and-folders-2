import {Injectable} from "@angular/core";
import {MultiRenameDialogData} from "./data/multi-rename-dialog.data";
import {MultiRenameDialogComponent} from "./multi-rename-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {MultiRenameDialogConfig} from "./multi-rename-dialog.config";
import {FileItem, FileItemIf} from "@fnf/fnf-data";
import {FileOperationParams} from "../../../domain/cmd/file-operation-params";

@Injectable({
  providedIn: "root"
})
export class MultiRenameDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: MultiRenameDialogData, cb: (target: FileOperationParams[] | undefined) => void) {
    let alive = true;
    const config = new MultiRenameDialogConfig(data);

    return this.dialog
      .open<MultiRenameDialogComponent, MultiRenameDialogData, FileOperationParams[] | undefined>(MultiRenameDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

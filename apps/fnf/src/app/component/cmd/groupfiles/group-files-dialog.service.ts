import {Injectable} from "@angular/core";
import {GroupFilesDialogData} from "./data/group-files-dialog.data";
import {GroupFilesDialogComponent} from "./group-files-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {GroupFilesDialogConfig} from "./group-files-dialog.config";
import {QueueActionEvent} from "../../../domain/cmd/queue-action-event";

@Injectable({
  providedIn: "root"
})
export class GroupFilesDialogService {


  constructor(
    public readonly dialog: MatDialog
  ) {
  }


  public open(data: GroupFilesDialogData, cb: (target: QueueActionEvent[] | undefined) => void) {
    let alive = true;
    const config = new GroupFilesDialogConfig(data);

    return this.dialog
      .open<GroupFilesDialogComponent, GroupFilesDialogData, QueueActionEvent[] | undefined>(GroupFilesDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        alive = false;
        cb(item);
      });
  }

}

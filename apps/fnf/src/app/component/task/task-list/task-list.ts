import {Component, inject} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-task-list',
  imports: [
    MatNavList,
    MatListItem,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {

  private _bottomSheetRef =
    inject<MatBottomSheetRef<TaskList>>(MatBottomSheetRef);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

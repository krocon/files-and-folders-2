import {Component, inject, OnInit} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatLine} from "@angular/material/core";
import {ActionQueueService} from "../../../service/cmd/action-queue.service";
import {NotifyService} from "../../../service/cmd/notify-service";
import {NotifyEventIf} from "../../../domain/cmd/notify-event.if";

@Component({
  selector: 'app-task-list',
  imports: [
    MatNavList,
    MatListItem,
    MatLine,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  private _bottomSheetRef =
    inject<MatBottomSheetRef<TaskList>>(MatBottomSheetRef);


  constructor(
    private readonly actionQueueService: ActionQueueService,
    private readonly notifyService: NotifyService,
  ) {
  }

  ngOnInit(): void {
    // this.actionQueueService.
    let queues = this.actionQueueService.getQueues();
    console.info(queues);

    this.notifyService
      .valueChanges()
      .subscribe(
        (evt: NotifyEventIf) => {
          console.info('NotifyEventIf', evt);
          console.info(this.actionQueueService.getQueues());
        }
      )
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

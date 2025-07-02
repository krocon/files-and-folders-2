import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ActionQueueService} from "../../../service/cmd/action-queue.service";
import {NotifyService} from "../../../service/cmd/notify-service";
import {QueueNotifyEventIf} from "../../../domain/cmd/queue-notify-event.if";
import {StatusIconType} from "../../common/status-icon.type";
import {QueueProgress} from "../../../domain/cmd/queue.progress";
import {BusyBeeComponent} from "../../common/busy-bee.component";
import {Queue} from "../../../domain/cmd/queue";
import {QueueStatus} from "../../../domain/cmd/queue-status";
import {QueueActionEvent} from "../../../domain/cmd/queue-action-event";


@Component({
  selector: 'app-task-list',
  imports: [
    BusyBeeComponent,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskList implements OnInit {

  queue: Queue;
  queueProgress: QueueProgress;
  status: StatusIconType = 'idle';


  private _bottomSheetRef =
    inject<MatBottomSheetRef<TaskList>>(MatBottomSheetRef);


  constructor(
    private readonly actionQueueService: ActionQueueService,
    private readonly notifyService: NotifyService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.queueProgress = actionQueueService.getQueueProgress(0);
    this.queue = actionQueueService.getQueue(0);
  }

  ngOnInit(): void {
    let queues = this.actionQueueService.getQueues();
    console.info('queues', queues);

    this.notifyService
      .valueChanges()
      .subscribe(
        (evt: QueueNotifyEventIf) => {
          this.updateUi();
        }
      )
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getBeeStatus(status: QueueStatus): StatusIconType {
    if (status === 'NEW' || status === 'IDLE' || status === 'PENDING') return 'idle';
    if (status === 'RUNNING' || status === 'PROCESSING') return 'busy';
    if (status === 'SUCCESS') return 'success';
    if (status === 'ERROR' || status === 'WARNING') return 'error';
    return 'idle';
  }

  getFileName(action: QueueActionEvent) {
    if (action?.filePara) {
      if (action.filePara.target?.base) return action.filePara.target?.base;
      if (action.filePara.source?.base) return action.filePara.source?.base;
      if (action.filePara.target?.dir) return action.filePara.target?.dir;
      if (action.filePara.source?.dir) return action.filePara.source?.dir;
    }
    return "";
  }

  private updateUi() {
    this.queueProgress = this.actionQueueService.getQueueProgress(0);

    let status: StatusIconType = 'idle';
    if (this.queueProgress.unfinished) {
      status = this.queueProgress.errors ? 'error' : 'busy';
    }
    this.status = status;
    this.cdr.detectChanges();

    console.info('--------------');
    console.info(this.queueProgress.getInfoText()); // "3 / 9"
    console.info(JSON.stringify(this.queueProgress, null, 4)); // {"unfinished": 6, "finished": 3, "errors": 0, "class": "text-info"}
  }
}

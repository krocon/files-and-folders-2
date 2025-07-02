import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ActionQueueService} from "../../../service/cmd/action-queue.service";
import {NotifyService} from "../../../service/cmd/notify-service";
import {NotifyEventIf} from "../../../domain/cmd/notify-event.if";
import {StatusIconType} from "../../common/status-icon.type";
import {QueueProgress} from "../../../domain/cmd/queue.progress";
import {BusyBeeComponent} from "../../common/busy-bee.component";
import {Queue} from "../../../domain/cmd/queue";
import {QueueStatus} from "../../../domain/cmd/queue-status";

@Component({
  selector: 'app-task-list',
  imports: [
    BusyBeeComponent,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection:ChangeDetectionStrategy.OnPush
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
        (evt: NotifyEventIf) => {
          this.updateUi();
        }
      )
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private updateUi() {
    this.queueProgress = this.actionQueueService.getQueueProgress(0);

    let status:StatusIconType = 'idle';
    if (this.queueProgress.unfinished) {
      status = this.queueProgress.errors ? 'error' : 'busy';
    }
    this.status = status;
    this.cdr.detectChanges();

    console.info('--------------');
    console.info(this.queueProgress.getInfoText()); // "3 / 9"
    console.info(JSON.stringify(this.queueProgress, null, 4)); // {"unfinished": 6, "finished": 3, "errors": 0, "class": "text-info"}
  }

  getBeeStatus(status: QueueStatus):StatusIconType {
    if (status==='NEW' || status==='IDLE'|| status==='PENDING') return 'idle';
    if (status==='RUNNING' || status==='PROCESSING') return 'busy';
    if (status==='SUCCESS') return 'success';
    if (status==='ERROR' || status==='WARNING') return 'error';
    return 'idle';
  }
}

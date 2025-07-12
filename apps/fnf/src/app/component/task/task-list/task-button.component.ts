import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MatButton} from "@angular/material/button";
import {ActionQueueService} from "../../../service/cmd/action-queue.service";
import {takeWhile} from "rxjs/operators";
import {QueueProgress} from "../../../domain/cmd/queue-progress";
import {MatTooltip} from "@angular/material/tooltip";
import {BusyBeeComponent} from "../../common/busy-bee.component";
import {MatIcon} from "@angular/material/icon";
import {StatusIconType} from "../../common/status-icon.type";
import {calcStatusIcon} from "./calc-status-icon.fn";


@Component({
  selector: "fnf-task-button",
  template: `


    <button
        (click)="onClicked()"
        class="panel-button row-reverse"
        [matTooltip]="infoText"
        mat-stroked-button>

      Tasks
      <mat-icon>
        <app-busy-bee [status]="status"></app-busy-bee>
      </mat-icon>

    </button>
  `,
  imports: [
    CommonModule,
    MatButton,
    MatTooltip,
    BusyBeeComponent,
    MatIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskButtonComponent implements OnInit, OnDestroy {

  @Output() onClick = new EventEmitter<number>();
  @Output() onClose = new EventEmitter<number>();

  infoText: string = '';
  queueProgress: QueueProgress;
  status: StatusIconType = 'idle';

  private alive = true;

  constructor(
    private readonly actionQueueService: ActionQueueService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.queueProgress = actionQueueService.getQueueProgress(0);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.actionQueueService
      .onEvent(ActionQueueService.REFRESH_JOB_QUEUE_TABLE)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(this.updateUi.bind(this));

    this.actionQueueService
      .onEvent(ActionQueueService.OPEN_JOB_QUEUE_TABLE)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(this.onClicked.bind(this));
  }

  onClicked() {
    this.onClick.next(Date.now());
  }

  private updateUi() {
    this.queueProgress = this.actionQueueService.getQueueProgress(0);
    this.infoText = this.queueProgress.finished + ' / ' + (this.queueProgress.finished + this.queueProgress.unfinished);
    this.status = calcStatusIcon(this.queueProgress);
    this.cdr.detectChanges();

    if (this.status === 'success') {
      this.onClose.next(Date.now());
    }
  }

}

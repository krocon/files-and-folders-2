import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AppService} from "../../../app.service";
import {ActionQueueService} from "../../../service/cmd/action-queue.service";
import {takeWhile} from "rxjs/operators";
import {QueueProgress} from "../../../domain/cmd/queue.progress";
import {MatTooltip} from "@angular/material/tooltip";


@Component({
  selector: "fnf-task-button",
  template: `

    <button
        (click)="onClicked()"
        class="panel-button row-reverse"
        [matTooltip]="queueProgress.getInfoText()"
        mat-stroked-button>
      Tasks
      <mat-icon>menu</mat-icon>
    </button>
  `,
  imports: [
    CommonModule,
    MatButton,
    MatIcon,
    MatTooltip,
  ]
})
export class TaskButtonComponent implements OnInit, OnDestroy {

  @Output() onClick = new EventEmitter<number>();

  queueProgress: QueueProgress;

  private alive = true;

  constructor(
    private readonly appService: AppService,
    private readonly actionQueueService: ActionQueueService,
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
      .subscribe(
        () => {
          console.info('refresh job queue table');
          this.updateUi();
        }
      )
  }

  onClicked() {
    this.onClick.next(Date.now());
  }

  private updateUi() {
    this.queueProgress = this.actionQueueService.getQueueProgress(0);
    console.info(this.queueProgress.getInfoText());
    console.info(JSON.stringify(this.queueProgress, null, 4));
  }
}

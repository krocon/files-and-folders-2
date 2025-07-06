import {QueueIf} from "./queue.if";
import {QueueStatus} from "./queue-status";
import {QueueActionEvent} from "./queue-action-event";
import {QueueProgress} from "./queue-progress";
import {QueueButtonStates} from "./queue-button-states";

export class Queue implements QueueIf {
  public status: QueueStatus = 'IDLE';
  public actions: QueueActionEvent[] = [];
  public jobId: number = 0;
  public progress: QueueProgress = new QueueProgress();
  public buttonStates: QueueButtonStates = new QueueButtonStates();

  constructor(options: Partial<QueueIf> = {}) {
    Object.assign(this, options);
  }
}
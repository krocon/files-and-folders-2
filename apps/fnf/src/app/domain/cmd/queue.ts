import {QueueStatus} from "./queue-status";
import {QueueActionEvent} from "./queue-action-event";
import {QueueProgress} from "./queue.progress";

export interface Queue {
  status: QueueStatus;
  actions: QueueActionEvent[];
  jobId: number;
  progress: QueueProgress;

  buttonStates: {
    pause: boolean;
    stop: boolean;
    resume: boolean;
    clean: boolean;
  }
}
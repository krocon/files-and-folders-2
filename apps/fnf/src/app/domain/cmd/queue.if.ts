import {QueueStatus} from "./queue-status";
import {QueueActionEvent} from "./queue-action-event";
import {QueueProgressIf} from "./queue-progress.if";
import {QueueButtonStates} from "./queue-button-states";

export interface QueueIf {
  status: QueueStatus;
  actions: QueueActionEvent[];
  jobId: number;
  progress: QueueProgressIf;

  buttonStates: QueueButtonStates;
}

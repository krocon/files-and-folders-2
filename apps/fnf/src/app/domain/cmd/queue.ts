import {QueueStatus} from "./queue-status";
import {ActionEvent} from "./action-event";
import {QueueProgress} from "./queue.progress";

export interface Queue {
  status: QueueStatus;
  actions: ActionEvent[];
  jobId: number;
  progress: QueueProgress;
}
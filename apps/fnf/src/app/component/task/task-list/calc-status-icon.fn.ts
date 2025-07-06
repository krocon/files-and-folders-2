import {StatusIconType} from "../../common/status-icon.type";
import {QueueProgress} from "../../../domain/cmd/queue-progress";

export function calcStatusIcon(queueProgress: QueueProgress): StatusIconType {
  let status: StatusIconType = 'idle';
  if (queueProgress.unfinished > 0) {
    status = queueProgress.errors ? 'error' : 'busy';
  } else if (queueProgress.finished > 0) {
    status = 'success';
  }
  return status;
}

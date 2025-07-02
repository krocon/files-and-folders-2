import {FileItemIf, FilePara, PanelIndex} from "@fnf/fnf-data";
import {QueueStatus} from "./queue-status";
import {QueueActionEventType} from "./queue-action-event.type";


export class QueueActionEvent {

  constructor(
    public panelIndex: PanelIndex,
    public filePara: FilePara,
    public status: QueueStatus,
    public bulk: boolean = false,
    public id: number = 0,
  ) {
  }

  // Getters to maintain compatibility with existing code
  get action(): QueueActionEventType {
    return this.filePara.cmd as unknown as QueueActionEventType;
  }

  get src(): FileItemIf {
    return this.filePara.source as FileItemIf;
  }

  get target(): FileItemIf {
    return this.filePara.target as FileItemIf;
  }
}

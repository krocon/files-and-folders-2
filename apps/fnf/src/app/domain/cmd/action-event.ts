import {PanelIndex} from "../panel-index";
import {FileItemIf, FilePara} from "@fnf/fnf-data";
import {QueueStatus} from "./queue-status";
import {ActionEventType} from "./action-event.type";


export class ActionEvent {

  constructor(
    public panelIndex: PanelIndex,
    public filePara: FilePara,
    public status: QueueStatus,
    public bulk: boolean = false,
    public id: number = 0,
  ) {
  }

  // Getters to maintain compatibility with existing code
  get action(): ActionEventType {
    return this.filePara.cmd as unknown as ActionEventType;
  }

  get src(): FileItemIf {
    return this.filePara.source as FileItemIf;
  }

  get target(): FileItemIf {
    return this.filePara.target as FileItemIf;
  }
}

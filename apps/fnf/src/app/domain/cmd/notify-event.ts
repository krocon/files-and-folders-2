import {NotifyEventIf} from "./notify-event.if";
import {ActionEventType} from "./action-event.type";
import {DirEventIf} from "@fnf/fnf-data";

export class NotifyEvent implements NotifyEventIf{

  constructor(
    public type: ActionEventType,
    public data: Array<DirEventIf> | any
  ) {
  }
}
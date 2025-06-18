import {ActionEventType} from "./action-event.type";
import {DirEventIf} from "@fnf/fnf-data";

export interface NotifyEventIf {

  type: ActionEventType;
  data: Array<DirEventIf> | any;

}
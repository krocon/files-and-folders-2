import {ActionEventType} from "./action-event.type";
import {OnDoResponseType} from "@fnf/fnf-data";

export interface NotifyEventIf {

  type: ActionEventType;
  data: OnDoResponseType;

}
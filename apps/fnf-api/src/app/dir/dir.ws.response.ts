import {WsResponse} from "@nestjs/websockets";
import {DirEvent, DirWatcherEventType} from "@fnf/fnf-data";

export class DirWsResponse implements WsResponse<DirEvent> {
  constructor(public event: DirWatcherEventType, public data: DirEvent) {
  }
}

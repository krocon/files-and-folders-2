import {DirWatcherEventType} from "@fnf/fnf-data";


export class WatchEventData {


  constructor(
    public event: DirWatcherEventType,
    public file: string
  ) {
  }
}

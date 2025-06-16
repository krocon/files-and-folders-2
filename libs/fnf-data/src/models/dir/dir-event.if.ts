import {FileItemIf} from './file-item.if';
import {DirWatcherEventType} from "./dir-watcher-event.type";

export interface DirEventIf {
  dir: string;
  items: FileItemIf[];
  begin: boolean;
  end: boolean;
  size: number;
  error: string;
  action: DirWatcherEventType;
  panelIndex: number;
}

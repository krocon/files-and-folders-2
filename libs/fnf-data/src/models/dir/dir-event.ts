import {DirEventIf} from './dir-event.if';
import {FileItemIf} from './file-item.if';
import {DirWatcherEventType} from "./dir-watcher-event.type";


export class DirEvent implements DirEventIf {

  constructor(
    public dir: string,
    public items: FileItemIf[] = [],
    public begin: boolean = false,
    public end: boolean = false,
    public size: number = 0,
    public error: string = '',
    public action: DirWatcherEventType = 'list',
    public panelIndex: number = 0
  ) {
  }

}

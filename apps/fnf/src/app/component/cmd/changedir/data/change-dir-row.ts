import {FileItem, FileItemIf} from '@fnf/fnf-data';

export class ChangeDirRow {
  constructor(
    public target: FileItemIf = new FileItem('')
  ) {
  }
}

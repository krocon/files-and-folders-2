import {FileItem, FileItemIf} from '@fnf/fnf-data';

export class GroupFilesRow {
  constructor(
    public id: number = 0,
    public base: string = '',
    public src: FileItemIf,
    public dir: string = '',
    public target: FileItemIf = new FileItem('')
  ) {}
}

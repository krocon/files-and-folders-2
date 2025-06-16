import {FileItemIf} from './file-item.if';

export class FileItem implements FileItemIf {


  constructor(
    public dir: string,
    public base: string = '',
    public ext: string = '',
    public date: string = '',
    public error: string = '',
    public size: number = 0,
    public isDir: boolean = false,
    public abs: boolean = false,
    public selected: boolean = false
  ) {
  }

}

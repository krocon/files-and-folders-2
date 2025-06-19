import {FileItemIf} from './file-item.if';
import {FileItemMetaIf} from "./file-item-meta.if";
import {FileItemMeta} from "./file-item-meta";

export class FileItem implements FileItemIf {



  constructor(
    public dir: string,
    public base: string = '',
    public ext: string = '',
    public date: string = '',
    public size: number = 0,
    public isDir: boolean = false,
    public abs: boolean = false,
    public meta: FileItemMetaIf = new FileItemMeta()
  ) {
  }

}

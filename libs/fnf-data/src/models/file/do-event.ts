
import {DoEventIf} from './do-event.if';
import {FileItemIf} from "../dir/file-item.if";

export class DoEvent implements DoEventIf {


  constructor(
    public source: FileItemIf,
    public target: FileItemIf,
    public cmd: string,
    public error = '',
    public stdout: string = '',
    public stderr: string = ''
  ) {
  }


}

import {FileItemIf} from "../dir/file-item.if";


export interface DoEventIf {

  error: string;
  source: FileItemIf;
  target: FileItemIf;
  cmd: string;
  stdout: string;
  stderr: string;

}

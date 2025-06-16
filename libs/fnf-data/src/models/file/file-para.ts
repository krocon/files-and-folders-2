import {FileCmd, FileItemIf} from "@fnf/fnf-data";

export class FilePara {

  constructor(
    public source?: FileItemIf,
    public target?: FileItemIf,
    public cmd: FileCmd = 'walk'
  ) {
  }
}

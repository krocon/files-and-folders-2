import {FileOperation} from "./file-operation";


export class CopyOrMoveDialogData {

  constructor(
    public source: string[] = [],
    public target = "",
    public fileOperation: FileOperation = "copy"
  ) {
  }
}

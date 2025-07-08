import {FileOperation} from "./file-operation";


export class CopyOrMoveOrDeleteDialogData {

  constructor(
    public source: string[] = [],
    public target = "",
    public fileOperation: FileOperation = "copy"
  ) {
  }
}

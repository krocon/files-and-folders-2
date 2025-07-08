import {TableApi} from "@guiexpert/table";
import {FileItemIf, WalkData} from "@fnf/fnf-data";


export class DirWalker {

  private lastTimestamp = 0;

  constructor(
    private readonly row: FileItemIf,
    private readonly tableApi: TableApi,
    private readonly callback: () => void
  ) {
  }

  public walkCallback(walkData: WalkData) {
    if (this.lastTimestamp < walkData.timestamp) {
      this.lastTimestamp = walkData.timestamp;
      this.row.size = walkData.sizeSum;
      this.tableApi.updateRows([this.row], (a: FileItemIf, b: FileItemIf) => (
        a.dir === b.dir && a.base === b.base
      ));
      this.callback();
    }
  }


}
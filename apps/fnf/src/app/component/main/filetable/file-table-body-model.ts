import {AreaModelObjectArrayWithColumndefs, ColumnDefIf} from "@guiexpert/table";
import {FileItemIf} from "@fnf/fnf-data";

export class FileTableBodyModel extends AreaModelObjectArrayWithColumndefs<FileItemIf> {


  constructor(columnDefs: ColumnDefIf[], defaultRowHeight: number = 34) {
    super("body", [], columnDefs, defaultRowHeight
      // TODO later
      // ,'fnf-selected-row'
      // ,'fnf-focused-row'
    );
  }

  override getCustomClassesAt(rowIndex: number, _columnIndex: number): string[] {
    const ret: string[] = [];
    const row:FileItemIf = this.getRowByIndex(rowIndex);
    const selected = row?.meta?.selected;

    if (selected) {
      ret.push('fnf-selected-row');
    }
    if (this.focusedRowIndex === rowIndex) {
      ret.push('fnf-focused-row');
    }
    return ret;
  }

  public getRowIndexByCriteria(criteria: Partial<FileItemIf>): number {
    return this.getFilteredRows().findIndex(
      row => row.base === criteria.base && row.dir === criteria.dir
    );
  }

  public getRowByCriteria(criteria: Partial<FileItemIf>): FileItemIf | undefined {
    return this.getFilteredRows().find(row => row.base === criteria.base && row.dir === criteria.dir);
  }


}

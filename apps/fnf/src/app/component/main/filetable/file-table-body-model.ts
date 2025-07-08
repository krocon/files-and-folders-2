import {AreaModelObjectArrayWithColumndefs, ColumnDefIf} from "@guiexpert/table";
import {FileItemIf} from "@fnf/fnf-data";

export class FileTableBodyModel extends AreaModelObjectArrayWithColumndefs<FileItemIf> {


  constructor(columnDefs: ColumnDefIf[], defaultRowHeight: number = 34) {
    super("body", [], columnDefs, defaultRowHeight);
  }

  override getCustomClassesAt(rowIndex: number, _columnIndex: number): string[] {
    const ret: string[] = [];
    const row: FileItemIf = this.getRowByIndex(rowIndex);
    const selected = row?.meta?.selected;

    if (selected) {
      ret.push('fnf-selected-row');
    }
    if (this.focusedRowIndex === rowIndex) {
      ret.push('fnf-focused-row');
    }
    return ret;
  }

  public getCriteriaFromFocussedRow(): Partial<FileItemIf> | null {
    let filteredRows = this.getFilteredRows();
    if (filteredRows.length === 0) {
      return null;
    }
    if (this.focusedRowIndex < 0) {
      this.focusedRowIndex = 0;
    }
    if (this.focusedRowIndex >= filteredRows.length) {
      this.focusedRowIndex = filteredRows.length - 1;
    }
    const row = filteredRows[this.focusedRowIndex] as FileItemIf;
    return {base: row.base, dir: row.dir};
  }

  public getRowByCriteria(criteria: Partial<FileItemIf>): FileItemIf | undefined {
    return this.getFilteredRows().find(row => row.base === criteria.base && row.dir === criteria.dir);
  }

  public setFocusByCriteria(criteria: Partial<FileItemIf>): void {
    this.focusedRowIndex = criteria ?
      this.getFilteredRows().findIndex(row => row.base === criteria.base && row.dir === criteria.dir)
      : 0;

    if (this.focusedRowIndex < 0) {
      this.focusedRowIndex = 0;
    } else {

      let filteredRows = this.getFilteredRows();
      if (filteredRows.length === 0) {
        this.focusedRowIndex = 0;
      } else if (this.focusedRowIndex >= filteredRows.length) {
        this.focusedRowIndex = filteredRows.length - 1;
      }
    }
  }

}

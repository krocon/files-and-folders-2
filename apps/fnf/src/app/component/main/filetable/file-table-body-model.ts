import {AreaModelObjectArrayWithColumndefs, ColumnDefIf} from "@guiexpert/table";
import {FileItemIf} from "@fnf/fnf-data";

export class FileTableBodyModel extends AreaModelObjectArrayWithColumndefs<FileItemIf> {


  constructor(
    columnDefs: ColumnDefIf[],
    defaultRowHeight: number = 34,
    private onFocusChanged: (focusRowIndex: number) => void = (focusRowIndex: number) => console.log
  ) {
    super("body", [], columnDefs, defaultRowHeight);
  }

  override getCustomClassesAt(rowIndex: number, _columnIndex: number): string[] {
    const ret: string[] = [];
    const row: FileItemIf = this.getRowByIndex(rowIndex);
    const selected = row?.meta?.selected;

    if (selected) {
      ret.push('fnf-selected-row');
    }
    if (this.getFocusedRowIndex() === rowIndex) {
      ret.push('fnf-focused-row');
    }
    return ret;
  }

  public getCriteriaFromFocussedRow(): Partial<FileItemIf> | null {
    let filteredRows = this.getFilteredRows();
    if (filteredRows.length === 0) {
      return null;
    }
    if (this.getFocusedRowIndex() < 0) {
      this.setFocusedRowIndex(0);
    }
    if (this.getFocusedRowIndex() >= filteredRows.length) {
      this.setFocusedRowIndex(filteredRows.length - 1);
    }
    const row = filteredRows[this.getFocusedRowIndex()] as FileItemIf;
    return {base: row.base, dir: row.dir};
  }

  public getRowByCriteria(criteria: Partial<FileItemIf>): FileItemIf | undefined {
    return this.getFilteredRows().find(row => row.base === criteria.base && row.dir === criteria.dir);
  }

  public setFocusByCriteria(criteria: Partial<FileItemIf>): void {
    this.setFocusedRowIndex(criteria ?
      this.getFilteredRows().findIndex(row => row.base === criteria.base && row.dir === criteria.dir)
      : 0);

    if (this.getFocusedRowIndex() < 0) {
      this.setFocusedRowIndex(0);
    } else {

      let filteredRows = this.getFilteredRows();
      if (filteredRows.length === 0) {
        this.setFocusedRowIndex(0);
      } else if (this.getFocusedRowIndex() >= filteredRows.length) {
        this.setFocusedRowIndex(filteredRows.length - 1);
      }
    }
  }

  public override setFocusedRowIndex(value: number) {
    super.setFocusedRowIndex(value);
    this.onFocusChanged(value);
  }

}

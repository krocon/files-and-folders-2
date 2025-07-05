import {AreaModelObjectArray, GeMouseEvent} from "@guiexpert/table";
import {BehaviorSubject} from "rxjs";


export class SelectionManagerForObjectModelsOptions<T> {

  isSelected: (row: T) => boolean = (v: T) => false;
  setSelected: (row: T, selected: boolean) => void = (v: T) => {
  };

  //public selectionKey: { [K in keyof T]: T[K] extends boolean | undefined ? K : never }[keyof T] = 'selected' as any;
  public isSelectable: (v: T) => boolean = (v: T) => true;
  public getKey: (a: T) => any = (a: T) => a;
  public equalRows: (a: T, b: T) => boolean = (a: T, b: T) => a === b;
}


export class SelectionManagerForObjectModels<T> {


  public readonly selection$ = new BehaviorSubject<T[]>([]);

  private previousRowIndex: number = -1;
  private focusIndex: number = -1;
  private evt: GeMouseEvent | undefined = undefined;


  constructor(
    private bodyModel: AreaModelObjectArray<T>,
    public options: SelectionManagerForObjectModelsOptions<T>
  ) {
  }

  // Method to get the current value of the selection$ (replaces signal() call)
  public getSelectionValue(): T[] {
    return this.selection$.getValue();
  }



  handleKeyEvent(evt: KeyboardEvent) {
    this.focusIndex = this.bodyModel.focusedRowIndex;
    if (this.focusIndex < 0) return; // skip

    if (evt.key === ' ') {
      this.toggleRowSelectionByIndex(this.focusIndex);
    }
    // TODO range selection?
  }

  handleGeMouseEvent(evt: GeMouseEvent): boolean {
    this.evt = evt;
    this.bodyModel.focusedRowIndex;
    return this.calcSelection();
  }

  toggleRowSelectionByIndex(rowIndex: number) {
    const row: T = this.bodyModel.getFilteredRows()[rowIndex];
    let selected = this.isRowSelected(row);
    this.setRowSelected(row, !selected);
    this.updateSelection();
  }

  toggleRowSelection(row: T) {
    let selected = this.isRowSelected(row);
    this.setRowSelected(row, !selected);
    this.updateSelection();
  }

  selectionAll() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, true));
    this.updateSelection();
  }

  clear() {
    this.deSelectionAll();
  }

  deSelectionAll() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, false));
    this.updateSelection();
  }

  toggleSelection() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, !this.isRowSelected(row)));
    this.updateSelection();
  }

  getSelectedRows(): T[] {
    return this.bodyModel?.getAllRows()
      .filter((row: any) => this.options.isSelectable(row) && this.isRowSelected(row));
  }

  applySelection2Model(keys: any[]): void {
    this.bodyModel?.getAllRows()
      .forEach((row: any) => {
        const key = this.options.getKey(row);
        let sel = keys.includes(key);
        this.setRowSelected(row, sel);
      });
    this.updateSelection();
  }

  updateSelection() {
    this.selection$.next(this.getSelectedRows());
  }

  setRowSelected(row: T, selected: boolean) {
    if (row && this.options.isSelectable(row)) {
      this.options.setSelected(row, selected);
    }
  }

  isRowSelected(row: T): boolean {
    return this.options.isSelected(row);
  }

  private calcSelection() {
    if (!this.bodyModel) return false;

    const evt = this.evt;

    let dirty = false;


    if (evt) {
      // Selection:
      if (!evt.originalEvent?.shiftKey) {
        this.deSelectionAll();
      }
      if (evt.originalEvent?.shiftKey && this.previousRowIndex > -1) {
        const r1 = Math.min(evt.rowIndex, this.previousRowIndex);
        const r2 = Math.max(evt.rowIndex, this.previousRowIndex);
        let rows: T[] = this.bodyModel.getFilteredRows();
        for (let i = r1; i <= r2; i++) {
          this.setRowSelected(rows[i], true);
        }
        dirty = true;

      } else if (evt.originalEvent?.altKey && (evt.originalEvent?.ctrlKey || evt.originalEvent?.metaKey)) {
        const row = this.bodyModel.getRowByIndex(evt.rowIndex);
        this.setRowSelected(row, false);
        dirty = true;

      } else if (evt.originalEvent?.ctrlKey || evt.originalEvent?.metaKey) {
        const row = this.bodyModel.getRowByIndex(evt.rowIndex);
        this.setRowSelected(row, true);
        dirty = true;

      } else {
        // no special key.
        // for selection$ type  'row' and 'column' we have to select the current row (or column):
        const row = this.bodyModel.getRowByIndex(evt.rowIndex);
        this.setRowSelected(row, true);
        dirty = true;
      }
      this.previousRowIndex = evt.rowIndex;
    }

    if (dirty) {
      this.updateSelection();
    }
    return dirty;
  }
}

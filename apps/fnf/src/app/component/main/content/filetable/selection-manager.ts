import {AreaModelObjectArray, GeMouseEvent} from "@guiexpert/table";
import {signal} from "@angular/core";
import {DOT_DOT, FileItemIf, FileItemMeta} from "@fnf/fnf-data";


export class SelectionManagerForObjectModelsOptions<T> {

  isSelected: (row: T) => boolean = (v: T) => false;
  setSelected: (row: T, selected:boolean) => void =  (v: T) => {};

  //public selectionKey: { [K in keyof T]: T[K] extends boolean | undefined ? K : never }[keyof T] = 'selected' as any;
  public isSelectable: (v: T) => boolean = (v: T) => true;
  public getKey: (a: T) => any = (a: T) => a;
  public equalRows: (a: T, b: T) => boolean = (a: T, b: T) => a === b;
}


export class SelectionManagerForObjectModels<T> {

  public readonly selection = signal<T[]>([]);

  private previousEvt?: GeMouseEvent;

  constructor(
    private bodyModel: AreaModelObjectArray<T>,
    public options: SelectionManagerForObjectModelsOptions<T>
  ) {
  }


  handleGeMouseEvent(evt: GeMouseEvent): boolean {
    return this.handleEvent(evt, this.previousEvt);
  }


  handleEvent(evt: GeMouseEvent, _previousEvt: GeMouseEvent | undefined): boolean {
    if (!this.bodyModel) return false;

    let dirty = false;
    let deletePreviousEvent = false;


    // Selection:
    if (!evt.originalEvent?.shiftKey) {
      this.deSelectionAll();
    }
    if (evt.originalEvent?.shiftKey && this.previousEvt) {
      const r1 = Math.min(evt.rowIndex, this.previousEvt?.rowIndex);
      const r2 = Math.max(evt.rowIndex, this.previousEvt?.rowIndex);
      let rows: T[] = this.bodyModel.getFilteredRows();
      for (let i = r1; i <= r2; i++) {
        this.setRowSelected(rows[i], true);
      }
      deletePreviousEvent = true;
      dirty = true;

    } else if (evt.originalEvent?.altKey && (evt.originalEvent?.ctrlKey || evt.originalEvent?.metaKey)) {
      const row = this.bodyModel.getRowByIndex(evt.rowIndex);
      this.setRowSelected(row, false);
      deletePreviousEvent = true;
      dirty = true;

    } else if (evt.originalEvent?.ctrlKey || evt.originalEvent?.metaKey) {
      const row = this.bodyModel.getRowByIndex(evt.rowIndex);
      this.setRowSelected(row, true);
      deletePreviousEvent = true;
      dirty = true;

    } else {
      // no special key.
      // for selection type  'row' and 'column' we have to select the current row (or column):
      const row = this.bodyModel.getRowByIndex(evt.rowIndex);
      this.setRowSelected(row, true);
      dirty = true;
    }

    if (deletePreviousEvent) {
      this.previousEvt = undefined;
    } else {
      this.previousEvt = evt?.clone();
    }
    if (dirty) {
      this.updateSelection();
    }
    return dirty;
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

  clear(){
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
    this.selection.set(this.getSelectedRows());
  }

  setRowSelected(row: T, selected: boolean) {
    if (row && this.options.isSelectable(row)) {
      this.options.setSelected(row, selected);
    }
  }

  isRowSelected(row: T): boolean {
    return this.options.isSelected(row);
  }
}

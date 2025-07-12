import {AreaModelObjectArray, GeMouseEvent, TableApi} from "@guiexpert/table";
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

const SPACE = ' ';

export class SelectionManagerForObjectModels<T> {


  public readonly selection$ = new BehaviorSubject<T[]>([]);

  public tableApi: TableApi | undefined;

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


  public handleKeyDownEvent(evt: KeyboardEvent) {
    if (evt.key === SPACE) {
      this.focusIndex = this.bodyModel.getFocusedRowIndex();
      if (this.focusIndex < 0) return; // skip

      // Toggle selection for current row
      this.toggleRowSelectionByIndex(this.focusIndex);

      // Store the last selected index for range selection
      this.previousRowIndex = this.focusIndex;

      // Move focus to next row if possible
      const nextFocusIndex = Math.min(
        this.bodyModel.getFilteredRows().length - 1,
        this.focusIndex + 1
      );

      if (nextFocusIndex > this.focusIndex) {
        this.bodyModel.setFocusedRowIndex(nextFocusIndex);
      }

      // Prevent default space behavior (scrolling)
      evt.preventDefault();
    }
    this.tableApi?.repaint();
  }


  public handleKeyUpEvent(evt: KeyboardEvent) {
    this.focusIndex = this.bodyModel.getFocusedRowIndex();
    if (this.focusIndex < 0) return; // skip

    if (evt.key === ' ') {
      // Space key handling moved to handleKeyDownEvent
    } else if ((evt.key === 'ArrowUp' || evt.key === 'ArrowDown')) {
      // Calculate the new focus index based on arrow key
      const newFocusIndex = evt.key === 'ArrowUp'
        ? Math.max(0, this.focusIndex)
        : Math.min(this.bodyModel.getFilteredRows().length - 1, this.focusIndex);

      // Always update the cursor position regardless of shift key
      this.bodyModel.setFocusedRowIndex(newFocusIndex);

      if (evt.shiftKey && this.previousRowIndex > -1) {
        // Handle range selection with shift + arrow keys
        // Select the range between previous selection and current focus
        const r1 = Math.min(newFocusIndex, this.previousRowIndex);
        const r2 = Math.max(newFocusIndex, this.previousRowIndex);
        let rows: T[] = this.bodyModel.getFilteredRows();
        for (let i = r1; i <= r2; i++) {
          this.setRowSelected(rows[i], true);
        }
        this.updateSelection();
      } else if (!evt.shiftKey && (evt.ctrlKey || evt.metaKey)) {
        // No shift key but with Ctrl/Meta key - toggle selection
        const row = this.bodyModel.getRowByIndex(newFocusIndex);
        if (row) {
          this.toggleRowSelection(row);
        }
        this.updateSelection();
      }
      // No selection change for plain arrow keys (without modifiers)

      // Update the previous row index for future range selections
      if (evt.shiftKey || evt.ctrlKey || evt.metaKey) {
        this.previousRowIndex = newFocusIndex;
      }
    }
    this.tableApi?.repaint();
  }

  public handleGeMouseEvent(evt: GeMouseEvent): boolean {
    this.evt = evt;
    this.focusIndex = this.bodyModel.getFocusedRowIndex();
    return this.calcSelection();
  }

  public toggleRowSelection(row: T) {
    let selected = this.isRowSelected(row);
    this.setRowSelected(row, !selected);
    this.updateSelection();
  }

  public selectionAll() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, true));
    this.updateSelection();
  }

  public clear() {
    this.deSelectionAll();
  }

  public deSelectionAll() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, false));
    this.updateSelection();
  }

  public toggleSelection() {
    this.bodyModel?.getAllRows().forEach((row: any) => this.setRowSelected(row, !this.isRowSelected(row)));
    this.updateSelection();
  }

  public getSelectedRows(): T[] {
    return this.bodyModel?.getAllRows()
      .filter((row: any) => this.options.isSelectable(row) && this.isRowSelected(row));
  }

  public applySelection2Model(keys: any[]): void {
    this.bodyModel?.getAllRows()
      .forEach((row: any) => {
        const key = this.options.getKey(row);
        let sel = keys.includes(key);
        this.setRowSelected(row, sel);
      });
    this.updateSelection();
  }

  public updateSelection() {
    this.selection$.next(this.getSelectedRows());
  }

  public setRowSelected(row: T, selected: boolean) {
    if (row && this.options.isSelectable(row)) {
      this.options.setSelected(row, selected);
    }
  }

  public isRowSelected(row: T): boolean {
    return this.options.isSelected(row);
  }

  private toggleRowSelectionByIndex(rowIndex: number) {
    const row: T = this.bodyModel.getFilteredRows()[rowIndex];
    let selected = this.isRowSelected(row);
    this.setRowSelected(row, !selected);
    this.updateSelection();
  }

  private calcSelection() {
    if (!this.bodyModel) return false;

    const evt = this.evt;
    let dirty = false;

    if (evt) {
      // Selection:
      if (!evt.originalEvent?.shiftKey && !evt.originalEvent?.ctrlKey && !evt.originalEvent?.metaKey) {
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
        // Toggle selection when Ctrl/Meta key is pressed
        this.toggleRowSelection(row);
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

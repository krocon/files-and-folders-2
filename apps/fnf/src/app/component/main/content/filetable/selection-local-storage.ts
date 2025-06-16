import {SelectionManagerForObjectModels} from "./selection-manager";


export class SelectionLocalStorage<T> {

  private usedKeys: string[] = [];

  constructor(
    private keyPrefix: string,
    private readonly selectionManager: SelectionManagerForObjectModels<T>,
  ) {
  }

  persistSelection(tableKey: string) {
    const selected: T[] = this.selectionManager.getSelectedRows();
    if (selected?.length) {
      const value = selected.map((row: T) => this.selectionManager.options.getKey(row));
      localStorage.setItem(this.getStorageKey(tableKey), JSON.stringify(value));
      this.usedKeys.push(this.getStorageKey(tableKey));
    } else {
      localStorage.removeItem(this.getStorageKey(tableKey));
    }
  }

  apply(tableKey: string) {
    const json = localStorage.getItem(this.getStorageKey(tableKey));
    if (json) {
      const selected: T[] = JSON.parse(json);
      this.selectionManager.applySelection2Model(selected);
    }
  }

  clearAll(): void {
    for (const usedKey of this.usedKeys) {
      localStorage.removeItem(usedKey);
    }
  }

  private getStorageKey(key: string) {
    return 'selection_' + this.keyPrefix + key;
  }

}

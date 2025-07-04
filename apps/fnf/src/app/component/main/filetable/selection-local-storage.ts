import {SelectionManagerForObjectModels} from "./selection-manager";

import {PanelIndex} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";
import {Injectable} from "@angular/core";

export type SelectionLocalStorageDataType = [
  { [key: string]: string[] },
  { [key: string]: string[] }
];



@Injectable({
  providedIn: "root"
})
export class SelectionLocalStorage {

  private readonly innerService = new TypedDataService<SelectionLocalStorageDataType>("selections", [{}, {}]);


  persistSelection<T>(panelIndex: PanelIndex, path: string, selectionManager: SelectionManagerForObjectModels<T>) {
    const selected: T[] = selectionManager.getSelectedRows();

    if (selected?.length) {
      const value = selected.map((row: T) => selectionManager.options.getKey(row));

      const data: SelectionLocalStorageDataType = this.innerService.getValue();
      data[panelIndex][path] = value;
      this.innerService.update(data);

    } else {
      const data: SelectionLocalStorageDataType = this.innerService.getValue();
      delete data[panelIndex][path];
      this.innerService.update(data);
    }
  }

  applySelection<T>(panelIndex: PanelIndex, path: string, selectionManager: SelectionManagerForObjectModels<T>) {
    const data: SelectionLocalStorageDataType = this.innerService.getValue();
    const selected: any[]|undefined = data[panelIndex][path];
    if (selected) {
      selectionManager.applySelection2Model(selected);
    }
  }

  clearAll(): void {
    this.innerService.update([{}, {}]);
  }


}

import {SelectionManagerForObjectModels} from "./selection-manager";

import {PanelIndex} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";
import {Injectable} from "@angular/core";

export type SelectionLocalStorageDataType = { [key: string]: string[] };


@Injectable({
  providedIn: "root"
})
export class SelectionLocalStorage {

  private readonly innerServices = [
    new TypedDataService<SelectionLocalStorageDataType>("selection0", {}),
    new TypedDataService<SelectionLocalStorageDataType>("selection1", {})
  ];


  persistSelection<T>(panelIndex: PanelIndex, path: string, selectionManager: SelectionManagerForObjectModels<T>) {
    const selected: T[] = selectionManager.getSelectedRows();
    const innerService = this.getInnerService(panelIndex);
    if (selected?.length) {
      const value = selected.map((row: T) => selectionManager.options.getKey(row));

      const data: SelectionLocalStorageDataType = innerService.getValue();
      data[path] = value;
      innerService.update(data);

    } else {
      const data: SelectionLocalStorageDataType = innerService.getValue();
      delete data[path];
      innerService.update(data);
    }
  }

  applySelection<T>(panelIndex: PanelIndex, path: string, selectionManager: SelectionManagerForObjectModels<T>) {
    const data: SelectionLocalStorageDataType = this.getInnerService(panelIndex).getValue();
    const selected: any[] | undefined = data[path];
    if (selected) {
      selectionManager.applySelection2Model(selected);
    }
  }

  clearAll(): void {
    this.getInnerService(0).update({});
    this.getInnerService(1).update({});
  }


  private getInnerService(panelIndex: PanelIndex): TypedDataService<SelectionLocalStorageDataType> {
    return this.innerServices[panelIndex];
  }

}

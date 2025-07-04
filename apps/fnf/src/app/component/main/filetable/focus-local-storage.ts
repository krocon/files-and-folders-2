import {FileItemIf, PanelIndex} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";
import {Injectable} from "@angular/core";
import {FileTableBodyModel} from "./file-table-body-model";

export type FocusLocalStorageDataType = { [key: string]: Partial<FileItemIf> };


@Injectable({
  providedIn: "root"
})
export class FocusLocalStorage {


  private readonly innerServices = [
    new TypedDataService<FocusLocalStorageDataType>("focus0", {}),
    new TypedDataService<FocusLocalStorageDataType>("focus1", {})
  ];


  persistFocus<T>(panelIndex: PanelIndex, path: string, fileTableBodyModel: FileTableBodyModel) {
    const criteria = fileTableBodyModel.getCriteriaFromFocussedRow();
    this.persistFocusCriteria(panelIndex, path, criteria);
  }

  persistFocusCriteria<T>(panelIndex: PanelIndex, path: string, criteria: Partial<FileItemIf> | null | undefined) {
    const innerService = this.getInnerService(panelIndex);
    if (criteria) {
      const data: FocusLocalStorageDataType = innerService.getValue();
      data[path] = criteria;
      innerService.update(data);

    } else {
      const data: FocusLocalStorageDataType = innerService.getValue();
      delete data[path];
      innerService.update(data);
    }
  }

  applyFocus<T>(panelIndex: PanelIndex, path: string, fileTableBodyModel: FileTableBodyModel) {
    const data: FocusLocalStorageDataType = this.getInnerService(panelIndex).getValue();
    const criteria: Partial<FileItemIf> | undefined = data[path];
    fileTableBodyModel.setFocusByCriteria(criteria);
  }

  clearAll(): void {
    this.getInnerService(0).update({});
    this.getInnerService(1).update({});
  }

  private getInnerService(panelIndex: PanelIndex): TypedDataService<FocusLocalStorageDataType> {
    return this.innerServices[panelIndex];
  }

}

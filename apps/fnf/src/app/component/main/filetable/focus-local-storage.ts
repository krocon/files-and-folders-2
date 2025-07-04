import {FileItemIf, PanelIndex} from "@fnf/fnf-data";
import {TypedDataService} from "../../../common/typed-data.service";
import {Injectable} from "@angular/core";
import {FileTableBodyModel} from "./file-table-body-model";

export type FocusLocalStorageDataType = [
  { [key: string]: Partial<FileItemIf> },
  { [key: string]: Partial<FileItemIf> }
];


@Injectable({
  providedIn: "root"
})
export class FocusLocalStorage {

  private readonly innerService = new TypedDataService<FocusLocalStorageDataType>("focusData", [{}, {}]);


  persistFocus<T>(panelIndex: PanelIndex, path: string, fileTableBodyModel: FileTableBodyModel) {
    const criteria = fileTableBodyModel.getCriteriaFromFocussedRow();
    this.persistFocusCriteria(panelIndex, path, criteria);
  }

  persistFocusCriteria<T>(panelIndex: PanelIndex, path: string, criteria: Partial<FileItemIf>|null|undefined) {
    if (criteria) {
      const data: FocusLocalStorageDataType = this.innerService.getValue();
      data[panelIndex][path] = criteria;
      this.innerService.update(data);

    } else {
      const data: FocusLocalStorageDataType = this.innerService.getValue();
      delete data[panelIndex][path];
      this.innerService.update(data);
    }
  }

  applyFocus<T>(panelIndex: PanelIndex, path: string, fileTableBodyModel: FileTableBodyModel) {
    const data: FocusLocalStorageDataType = this.innerService.getValue();
    const criteria: Partial<FileItemIf> | undefined = data[panelIndex][path];
    fileTableBodyModel.setFocusByCriteria(criteria);
  }

  clearAll(): void {
    this.innerService.update([{}, {}]);
  }


}

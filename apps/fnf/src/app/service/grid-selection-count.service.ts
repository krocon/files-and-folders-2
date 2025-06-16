import {Injectable} from "@angular/core";
import {SelectionLabelData} from "../domain/filepagedata/data/selection-label.data";
import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";
import {formatFileSize} from "../common/fn/format-file-size";
import {SelectionEvent} from "../domain/filepagedata/data/selection-event";

@Injectable({
  providedIn: "root"
})
export class GridSelectionCountService {


  getSelectionCountData(
    selectedRows: FileItemIf[],
    allRows: FileItemIf[],
  ): SelectionEvent {

    selectedRows = selectedRows.filter(f => f.base !== DOT_DOT);
    allRows = allRows.filter(f => f.base !== DOT_DOT);

    const selectionLabelData = new SelectionLabelData(
      this.getSelectedSizeSumText(selectedRows),
      this.getSizeSumText(allRows),

      this.getSelectedFileCount(selectedRows),
      this.getFileCount(allRows),

      this.getSelectedFolderCount(selectedRows),
      this.getFolderCount(allRows)
    );
    return new SelectionEvent(
      selectionLabelData,
      selectedRows, this.getSizeSum(selectedRows),
      allRows, this.getSizeSum(allRows)
    )
  }

  private getSizeSumText(selectedRows: FileItemIf[]) {
    const sizeSum = this.getSizeSum(selectedRows);
    return this.fileSizeSI(sizeSum);
  }

  private getSelectedSizeSumText(selectedRows: FileItemIf[]) {
    const selectedSizeSum = this.getSelectedSizeSum(selectedRows);
    return this.fileSizeSI(selectedSizeSum);
  }

  private fileSizeSI(size: number): string {
    let ret = formatFileSize(size);
    return ret;
  }

  private getSelectedFileCount(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (!selectedRows[i].isDir) ret++;
    }
    return ret;
  }

  private getSelectedSizeSum(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].size) ret = ret + selectedRows[i].size;
    }
    return ret;
  };

  private getSelectedFolderCount(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].isDir) ret++;
    }
    return ret;
  }

  private getFolderCount(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].isDir) ret++;
    }
    return ret;
  }

  private getFileCount(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (!selectedRows[i].isDir) ret++;
    }
    return ret;
  }

  private getSizeSum(selectedRows: FileItemIf[]): number {
    if (!selectedRows) return 0;

    let ret = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].size) ret = ret + selectedRows[i].size;
    }
    return ret;
  }


}


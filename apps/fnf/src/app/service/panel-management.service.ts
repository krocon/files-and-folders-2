import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FileItemIf, PanelIndex} from '@fnf/fnf-data';
import {PanelSelectionService} from '../domain/filepagedata/service/panel-selection.service';
import {TabsPanelDataService} from '../domain/filepagedata/tabs-panel-data.service';
import {TabsPanelData} from '../domain/filepagedata/data/tabs-panel.data';
import {TabData} from '../domain/filepagedata/data/tab.data';
import {FileTableBodyModel} from '../component/main/filetable/file-table-body-model';
import {SelectionManagerForObjectModels} from '../component/main/filetable/selection-manager';

@Injectable({
  providedIn: 'root'
})
export class PanelManagementService {

  constructor(
    private readonly panelSelectionService: PanelSelectionService,
    private readonly tabsPanelDataService: TabsPanelDataService
  ) {
  }

  setPanelActive(panelIndex: PanelIndex): void {
    this.panelSelectionService.update(panelIndex);
  }

  getActivePanelIndex(): PanelIndex {
    return this.panelSelectionService.getValue();
  }

  getInactivePanelIndex(): PanelIndex {
    return [1, 0][this.getActivePanelIndex()] as PanelIndex;
  }

  togglePanel(): void {
    this.panelSelectionService.toggle();
  }

  selectLeftPanel(): void {
    this.panelSelectionService.update(0);
  }

  selectRightPanel(): void {
    this.panelSelectionService.update(1);
  }

  getActiveTabOnActivePanel(): TabData {
    const pi = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(pi);
    return tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
  }

  getOtherPanelSelectedTabData(): TabData {
    const inactivePanelIndex = [1, 0][this.getActivePanelIndex()] as PanelIndex;
    const panelData: TabsPanelData = this.tabsPanelDataService.getValue(inactivePanelIndex);
    return panelData.tabs[panelData.selectedTabIndex];
  }

  filePageDataChanges(panelIndex: PanelIndex): Observable<TabsPanelData> {
    return this.tabsPanelDataService.valueChanges(panelIndex);
  }

  getSelectedData(
    panelIndex: PanelIndex,
    selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined]
  ): FileItemIf[] {
    return selectionManagers[panelIndex]?.getSelectedRows() ?? [];
  }

  getSelectedOrFocussedData(
    panelIndex: PanelIndex,
    selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined],
    bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined]
  ): FileItemIf[] {
    let ret = selectionManagers[panelIndex]?.getSelectedRows() ?? [];
    if (!ret?.length && bodyAreaModels[panelIndex]) {
      const focusedRowIndex = bodyAreaModels[panelIndex]?.getFocusedRowIndex() ?? 0;
      const frd = bodyAreaModels[panelIndex]?.getRowByIndex(focusedRowIndex) ?? null;
      if (frd) {
        ret = [frd];
      } else {
        ret = [];
      }
    }
    return ret ?? [];
  }

  getSelectedDataForActivePanel(
    selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined]
  ): FileItemIf[] {
    return this.getSelectedData(this.getActivePanelIndex(), selectionManagers);
  }

  getSelectedOrFocussedDataForActivePanel(
    selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined],
    bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined]
  ): FileItemIf[] {
    return this.getSelectedOrFocussedData(this.getActivePanelIndex(), selectionManagers, bodyAreaModels);
  }

  setBodyAreaModel(panelIndex: PanelIndex, m: FileTableBodyModel, bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined]): void {
    bodyAreaModels[panelIndex] = m;
  }

  setSelectionManagers(
    panelIndex: PanelIndex,
    m: SelectionManagerForObjectModels<FileItemIf>,
    selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined]
  ): void {
    selectionManagers[panelIndex] = m;
  }

  ensureFocusIsVisible(bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined]): void {
    const panelIndex = this.getActivePanelIndex();
    const bodyAreaModel = bodyAreaModels[panelIndex];
    if (bodyAreaModel) {
      // TODO hier gehts weiter. dass muss evtl in die api!
      // evtl in api focussedRowIndex als setter getter!
    }
  }

  createFileOperationParams(
    target: FileItemIf,
    selectedData: FileItemIf[],
    srcPanelIndex: PanelIndex,
    targetPanelIndex: PanelIndex
  ): any[] {
    return selectedData.map(item =>
      ({
        source: item,
        srcPanelIndex,
        target,
        targetPanelIndex,
        isMultiple: selectedData.length > 1
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CleanDialogData, DOT_DOT, FileItemIf, FindData, FindDialogData, PanelIndex} from '@fnf/fnf-data';
import {CleanDialogService} from '../component/cmd/clean/clean-dialog.service';
import {FindDialogService} from '../component/cmd/find/find-dialog.service';
import {FindSocketService} from '../service/find.socketio.service';
import {ChangeDirDialogService} from '../component/cmd/changedir/change-dir-dialog.service';
import {ChangeDirDialogData} from '../component/cmd/changedir/data/change-dir-dialog.data';
import {ChangeDirEvent} from '../service/change-dir-event';
import {ShortcutDialogService} from '../component/shortcut/shortcut-dialog.service';
import {SelectionDialogService} from '../component/cmd/selection/selection-dialog.service';
import {SelectionDialogData} from '../component/cmd/selection/selection-dialog.data';
import {TabData} from '../domain/filepagedata/data/tab.data';
import {ActionId} from '../domain/action/fnf-action.enum';

@Injectable({
  providedIn: 'root'
})
export class DialogManagementService {

  constructor(
    private readonly cleanDialogService: CleanDialogService,
    private readonly findDialogService: FindDialogService,
    private readonly findSocketService: FindSocketService,
    private readonly changeDirDialogService: ChangeDirDialogService,
    private readonly shortcutDialogService: ShortcutDialogService,
    private readonly selectionDialogService: SelectionDialogService
  ) {
  }

  openCleanDialog(
    data: CleanDialogData | null,
    getRelevantDirsFromActiveTab: () => string[],
    actionEvents$: Subject<ActionId>
  ): void {
    if (!data) {
      data = new CleanDialogData('', '**/*.bak', true);
      data.folders = getRelevantDirsFromActiveTab();
    }
    this.cleanDialogService.open(
      data,
      (result: CleanDialogData | undefined) => {
        actionEvents$.next('RELOAD_DIR');
      });
  }

  openFindDialog(
    data: FindDialogData | null,
    panelIndex: PanelIndex,
    getRelevantDirsFromActiveTab: () => string[],
    addTab: (panelIndex: PanelIndex, tabData: TabData) => void,
    updateTabsPanelData: (panelIndex: PanelIndex, tabsPanelData: any) => void,
    tabsPanelDatas: any[]
  ): void {
    if (!data) {
      data = new FindDialogData('', '**/*.*', true, false);
      data.folders = getRelevantDirsFromActiveTab();
    }
    this.findDialogService
      .open(data, (result: FindDialogData | undefined) => {
        if (result) {
          if (result.folder) {
            result.folders = result.folder.split(',');
            result.folder = '';
          }
          const findData: FindData = this.findSocketService.createFindData(result);

          if (findData.findDialogData.newtab) {
            const tabDataFindings = new TabData(findData.dirTabKey);
            tabDataFindings.findData = findData;
            addTab(panelIndex, tabDataFindings);

          } else {
            const tabsPanel = tabsPanelDatas[panelIndex];
            const tabData = tabsPanel.tabs[tabsPanel.selectedTabIndex];
            tabData.path = findData.dirTabKey;
            tabData.findData = findData;
            updateTabsPanelData(panelIndex, tabsPanelDatas[panelIndex]);
          }
        }
      });
  }

  openChangeDirDialog(
    activeTabPath: string,
    activePanelIndex: PanelIndex,
    changeDir: (evt: ChangeDirEvent) => void
  ): void {
    this.changeDirDialogService
      .open(
        new ChangeDirDialogData(activeTabPath, activePanelIndex),
        (result: ChangeDirEvent | undefined) => {
          if (result) {
            changeDir(result);
          }
        });
  }

  openShortcutDialog(): void {
    this.shortcutDialogService.open();
  }

  openSelectionDialog(data: SelectionDialogData, cb: (result: string | undefined) => void): void {
    this.selectionDialogService.open(data, cb);
  }

  requestFindings(
    findData: FindData,
    dirEvents$: BehaviorSubject<Map<string, any[]>>
  ): void {
    this.findSocketService
      .find(findData, event => {
        const currentMap = dirEvents$.getValue();
        const newMap = new Map(currentMap);
        newMap.set(findData.dirTabKey, [event]);
        dirEvents$.next(newMap);
      });
  }

  getRelevantDirsFromActiveTab(
    selectedData: FileItemIf[],
    activeTabPath: string
  ): string[] {
    let fileItems = selectedData.filter(fi => fi.isDir);
    if (fileItems.length === 1 && fileItems[0].base === DOT_DOT) {
      fileItems = [];
    }
    if (fileItems.length) {
      return fileItems.map(fi => `${fi.dir}/${fi.base}`);
    }
    return [activeTabPath];
  }
}

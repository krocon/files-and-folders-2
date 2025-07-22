import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {isZipUrl, PanelIndex} from '@fnf/fnf-data';
import {FileSystemService} from './file-system.service';
import {ChangeDirEventService} from './change-dir-event.service';
import {ChangeDirEvent} from './change-dir-event';
import {TabsPanelDataService} from '../domain/filepagedata/tabs-panel-data.service';
import {TabsPanelData} from '../domain/filepagedata/data/tabs-panel.data';
import {TabData} from '../domain/filepagedata/data/tab.data';
import {LatestDataService} from '../domain/filepagedata/service/latest-data.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private MAX_HISTORY_LENGTH = 15;

  constructor(
    private readonly fileSystemService: FileSystemService,
    private readonly changeDirEventService: ChangeDirEventService,
    private readonly tabsPanelDataService: TabsPanelDataService,
    private readonly latestDataService: LatestDataService
  ) {
  }

  async checkPath(path: string): Promise<string> {
    return await firstValueFrom(this.fileSystemService.checkPath(path));
  }

  async filterExists(files: string[]): Promise<string[]> {
    return await firstValueFrom(this.fileSystemService.filterExists(files));
  }

  changeDir(evt: ChangeDirEvent): void {
    this.changeDirEventService.next(evt);
  }

  onChangeDir(path: string, panelIndex: PanelIndex): void {
    this.changeDir(new ChangeDirEvent(panelIndex, path));
  }

  async setPathToActiveTabInGivenPanel(
    path: string,
    panelIndex: PanelIndex,
    tabsPanelDatas: [TabsPanelData, TabsPanelData],
    updateTabsPanelData: (panelIndex: PanelIndex, fileData: TabsPanelData) => void
  ): Promise<void> {
    console.info('setPathToActiveTabInGivenPanel ' + panelIndex, path);
    if (path.startsWith('tabfind')) {
      console.warn('setPathToActiveTabInGivenPanel: tabfind not supported yet');
    }
    try {
      let checkedPath = path;
      if (isZipUrl(path)) {
        // no path check
      } else {
        checkedPath = await this.checkPath(path);
      }

      const panelData: TabsPanelData = tabsPanelDatas[panelIndex];
      const tabData: TabData = panelData.tabs[panelData.selectedTabIndex];
      tabData.path = checkedPath;
      tabData.findData = undefined;

      if (!ChangeDirEventService.skipNextHistoryChange) {
        ChangeDirEventService.skipNextHistoryChange = false;

        // add checkedPath on top:
        tabData.history.splice(0, 0, checkedPath);
        // remove double items:
        tabData.history = tabData.history.filter((his, i, arr) => arr.indexOf(his) === i);
        // max count = 10:
        if (tabData.history.length > this.MAX_HISTORY_LENGTH) {
          tabData.history.length = this.MAX_HISTORY_LENGTH;
        }
        this.addLatest(checkedPath);
      }
      // update ui:
      updateTabsPanelData(panelIndex, panelData);

    } catch (e) {
      console.error(e);
    }
  }

  navigateBack(
    panelIndex: PanelIndex,
    tabsPanelDatas: [TabsPanelData, TabsPanelData],
    updateTabsPanelData: (panelIndex: PanelIndex, fileData: TabsPanelData) => void,
    changeDir: (evt: ChangeDirEvent) => void
  ): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex = Math.max(0, tabData.historyIndex + 1);
    tabData.historyIndex = Math.min(tabData.historyIndex, tabData.history.length - 1);
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    tabsPanelDatas[panelIndex] = tabsPanelData;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    changeDir(new ChangeDirEvent(panelIndex, path));
  }

  navigateForward(
    panelIndex: PanelIndex,
    tabsPanelDatas: [TabsPanelData, TabsPanelData],
    updateTabsPanelData: (panelIndex: PanelIndex, fileData: TabsPanelData) => void,
    changeDir: (evt: ChangeDirEvent) => void
  ): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex--;
    if (tabData.historyIndex < 0) tabData.historyIndex = tabData.history.length - 1;
    if (tabData.historyIndex > tabData.history.length - 1) tabData.historyIndex = 0;
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    tabsPanelDatas[panelIndex] = tabsPanelData;

    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    changeDir(new ChangeDirEvent(panelIndex, path));
  }

  async model2local(
    panelIndex: 0 | 1,
    tabsPanelDatas: [TabsPanelData, TabsPanelData],
    updateTabsPanelData: (panelIndex: PanelIndex, fileData: TabsPanelData) => void
  ): Promise<void> {
    const tabData = this.getTabDataForPanelIndex(panelIndex, tabsPanelDatas);
    if (tabData) {
      if (tabData.path.startsWith('tabfind')) {
        updateTabsPanelData(panelIndex, tabsPanelDatas[panelIndex]);
      } else {
        try {
          const path = await this.checkPath(tabData.path);
          if (tabData.path !== path) {
            await this.setPathToActiveTabInGivenPanel(path, panelIndex, tabsPanelDatas, updateTabsPanelData);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  getDirsFromAllTabs(): string[] {
    const ret: string[] = [];

    const tabPanelDatas = [
      this.tabsPanelDataService.getValue(0),
      this.tabsPanelDataService.getValue(1),
    ];
    for (const tabRow of tabPanelDatas) {
      for (const tab of tabRow.tabs) {
        if (!ret.includes(tab.path)) {
          ret.push(tab.path);
        }
      }
    }
    return ret;
  }

  private addLatest(item: string): void {
    this.latestDataService.addLatest(item);
  }

  private getTabDataForPanelIndex(panelIndex: 0 | 1, tabsPanelDatas: [TabsPanelData, TabsPanelData]): TabData {
    const panelData: TabsPanelData = tabsPanelDatas[panelIndex];
    return panelData.tabs[panelData.selectedTabIndex];
  }
}

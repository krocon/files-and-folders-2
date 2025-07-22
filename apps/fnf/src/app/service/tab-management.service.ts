import {Injectable} from '@angular/core';
import {PanelIndex} from '@fnf/fnf-data';
import {TabsPanelDataService} from '../domain/filepagedata/tabs-panel-data.service';
import {TabsPanelData} from '../domain/filepagedata/data/tabs-panel.data';
import {TabData} from '../domain/filepagedata/data/tab.data';

@Injectable({
  providedIn: 'root'
})
export class TabManagementService {

  constructor(
    private readonly tabsPanelDataService: TabsPanelDataService
  ) {
  }

  addTab(panelIndex: PanelIndex, tabData: TabData): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    tabsPanelData.tabs.push(tabData);
    tabsPanelData.selectedTabIndex = tabsPanelData.tabs.length - 1;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
  }

  removeTab(panelIndex: PanelIndex): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);

    if (tabsPanelData.tabs.length > 1) {
      const selectedTabIndex = tabsPanelData.selectedTabIndex;
      tabsPanelData.tabs.splice(selectedTabIndex, 1);
      tabsPanelData.selectedTabIndex = Math.min(tabsPanelData.tabs.length - 1, selectedTabIndex);
      this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    }
  }

  addNewTab(panelIndex: PanelIndex): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
    tabsPanelData.tabs.push(this.clone(tabData));
    tabsPanelData.selectedTabIndex = tabsPanelData.tabs.length - 1;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
  }

  nextTab(panelIndex: PanelIndex): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    tabsPanelData.selectedTabIndex = (tabsPanelData.selectedTabIndex + 1) % tabsPanelData.tabs.length;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
  }

  getActiveTabOnPanel(panelIndex: PanelIndex): TabData {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    return tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
  }

  getTabDataForPanelIndex(panelIndex: 0 | 1): TabData {
    const panelData: TabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    return panelData.tabs[panelData.selectedTabIndex];
  }

  toggleFilter(panelIndex: PanelIndex): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
    tab.filterActive = !tab.filterActive;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
  }

  toggleHiddenFiles(panelIndex: PanelIndex): void {
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
    tab.hiddenFilesVisible = !tab.hiddenFilesVisible;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
  }

  updateTabsPanelData(panelIndex: PanelIndex, fileData: TabsPanelData): void {
    this.tabsPanelDataService.update(panelIndex, fileData);
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
}
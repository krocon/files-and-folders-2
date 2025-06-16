import {TabData} from "./tab.data";

export class TabsPanelData {

  constructor(
    public panelIndex: number = 0,
    public tabs: TabData[],
    public selectedTabIndex: number = 0,
  ) {
  }

}

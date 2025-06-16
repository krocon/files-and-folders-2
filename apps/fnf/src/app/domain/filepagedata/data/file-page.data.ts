import {TabData} from "./tab.data";
import {TabsPanelData} from "./tabs-panel.data";

export class FilePageData {

  default = true;
  tabRows: TabsPanelData[];
  counter = 0; // for changing object without changing domain (reload)

  constructor(
    tabRows: TabsPanelData[] = [
      new TabsPanelData(0, [new TabData("/")], 0),
      new TabsPanelData(1, [new TabData("/")], 0)
    ]
  ) {
    this.tabRows = tabRows;
  }

}

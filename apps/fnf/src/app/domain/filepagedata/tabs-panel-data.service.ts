import {Injectable} from "@angular/core";
import {TypedDataService} from "../../common/typed-data.service";
import {TabData} from "./data/tab.data";
import {BehaviorSubject} from "rxjs";
import {PanelIndex} from "@fnf/fnf-data";
import {TabsPanelData} from "./data/tabs-panel.data";

@Injectable({
  providedIn: "root"
})
export class TabsPanelDataService {

  private readonly innerServices = [
    new TypedDataService<TabsPanelData>("tabs0", new TabsPanelData(0, [new TabData('/')], 0)),
    new TypedDataService<TabsPanelData>("tabs1", new TabsPanelData(1, [new TabData("/")], 0))
  ];


  public valueChanges(panelIndex: PanelIndex): BehaviorSubject<TabsPanelData> {
    return this.getInnerService(panelIndex).valueChanges$;
  }

  public addTab(panelIndex: PanelIndex, tabData: TabData) {
    let innerService = this.getInnerService(panelIndex);
    let value = innerService.getValue();
    value.tabs.push(tabData);
    innerService.update(value);
  }

  public update(panelIndex: PanelIndex, tabsPanelData: TabsPanelData) {
    this.getInnerService(panelIndex).update(this.clone(tabsPanelData));
  }


  public getValue(panelIndex: PanelIndex): TabsPanelData {
    return this.getInnerService(panelIndex).getValue() as TabsPanelData;
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private getInnerService(panelIndex: PanelIndex): TypedDataService<TabsPanelData> {
    return this.innerServices[panelIndex];
  }
}

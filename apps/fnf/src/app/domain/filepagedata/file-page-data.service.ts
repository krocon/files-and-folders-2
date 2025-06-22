import {Injectable} from "@angular/core";
import {TypedDataService} from "../../common/typed-data.service";
import {FilePageData} from "./data/file-page.data";
import {TabData} from "./data/tab.data";
import {BehaviorSubject} from "rxjs";
import {PanelIndex} from "../panel-index";
import {TypeDataDefaultOptions} from "../../common/type-data-default-options";


@Injectable({
  providedIn: "root"
})
export class FilePageDataService {

  private static readonly innerService =
    new TypedDataService<FilePageData>(
      "tabs",
      new FilePageData(),
      // {
      //   ...new TypeDataDefaultOptions<FilePageData>(),
      //   parse: (s: string) => {
      //     if (s === null) {
      //       return null;
      //     }
      //     return {
      //       ...new FilePageData(),
      //       ...JSON.parse(s) as FilePageData
      //     };
      //   }
      // }
    );

  public valueChanges(): BehaviorSubject<FilePageData> {
    return FilePageDataService.innerService.valueChanges$;
  }

  public addTab(panelIndex: PanelIndex, tabData: TabData) {
    this.getValue().tabRows[panelIndex].tabs.push(tabData);
    FilePageDataService.innerService.update(this.getValue());
  }

  public update(fileData: FilePageData) {
    FilePageDataService.innerService.update(this.clone(fileData));
  }


  public getValue(): FilePageData {
    if (FilePageDataService.innerService.getValue() === null) {
      FilePageDataService.innerService.update(new FilePageData());
    }
    return FilePageDataService.innerService.getValue() as FilePageData;
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
}

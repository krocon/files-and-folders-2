import {Injectable} from "@angular/core";
import {TypedDataService} from "../../../common/typed-data.service";
import {PanelIndex} from "@fnf/fnf-data";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: "root"
})
export class PanelSelectionService {

  private static readonly innerService =
    new TypedDataService<PanelIndex>("activePanelIndex", 0);

  public valueChanges$(): BehaviorSubject<PanelIndex> {
    return PanelSelectionService.innerService.valueChanges$;
  }

  public toggle() {
    const pi = PanelSelectionService.innerService.getValue();
    const newValue = pi === 0 ? 1 : 0;
    PanelSelectionService.innerService.update(newValue);
    PanelSelectionService.innerService.valueChanges$.next(newValue);
  }

  public update(panelIndex: PanelIndex) {
    PanelSelectionService.innerService.update(panelIndex);
    PanelSelectionService.innerService.valueChanges$.next(panelIndex);
  }

  public getValue(): PanelIndex {
    let panelIndex = PanelSelectionService.innerService.getValue();
    if (panelIndex === null) {
      panelIndex = 0;
    }
    return panelIndex;
  }
}

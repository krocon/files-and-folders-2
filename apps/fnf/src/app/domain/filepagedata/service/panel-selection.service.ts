import {Injectable, signal, Signal} from "@angular/core";
import {TypedDataService} from "../../../common/typed-data.service";
import {PanelIndex} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class PanelSelectionService {

  private static readonly innerService =
    new TypedDataService<PanelIndex>("activePanelIndex", 0);

  private panelIndexSignal = signal<PanelIndex>(this.getValue());
  public panelIndex: Signal<PanelIndex> = this.panelIndexSignal.asReadonly();

  public toggle() {
    const pi = PanelSelectionService.innerService.getValue();
    const newValue = pi === 0 ? 1 : 0;
    PanelSelectionService.innerService.update(newValue);
    PanelSelectionService.innerService.valueChanges$.next(newValue);
    this.panelIndexSignal.set(newValue);
  }

  public update(panelIndex: PanelIndex) {
    PanelSelectionService.innerService.update(panelIndex);
    PanelSelectionService.innerService.valueChanges$.next(panelIndex);
    this.panelIndexSignal.set(panelIndex);
  }

  public getValue(): PanelIndex {
    let panelIndex = PanelSelectionService.innerService.getValue();
    if (panelIndex === null) {
      panelIndex = 0;
    }
    return panelIndex;
  }
}

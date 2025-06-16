import {PanelIndex} from "../domain/panel-index";

export class ChangeDirEvent {

  constructor(
    public panelIndex: PanelIndex = 0,
    public path: string = ""
  ) {
  }

}

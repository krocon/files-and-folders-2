import {PanelIndex} from "@fnf/fnf-data";

export class ChangeDirEvent {

  constructor(
    public panelIndex: PanelIndex = 0,
    public path: string = ""
  ) {
  }

}

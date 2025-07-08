import {PanelIndex} from "@fnf/fnf-data";


export class ChangeDirDialogData {


  constructor(
    public sourceDir: string = '',
    public sourcePanelIndex: PanelIndex = 0,
  ) {
  }
}

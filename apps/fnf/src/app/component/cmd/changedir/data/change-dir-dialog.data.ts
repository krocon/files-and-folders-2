import {PanelIndex} from "@fnf/fnf-data";


export class ChangeDirDialogData {

  public showParentTree = true;

  constructor(
    public sourceDir: string = '',
    public sourcePanelIndex: PanelIndex = 0,
  ) {
  }
}

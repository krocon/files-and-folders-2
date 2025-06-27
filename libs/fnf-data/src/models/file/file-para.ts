import {FileCmd, FileItemIf} from "@fnf/fnf-data";
import {PanelIndex} from "./panel-index";

export class FilePara {

  constructor(
    public source?: FileItemIf,
    public target?: FileItemIf,

    public sourcePanelIndex?: PanelIndex,
    public targetPanelIndex?: PanelIndex,

    public cmd: FileCmd = 'walk',
  ) {
  }
}

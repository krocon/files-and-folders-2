import {FileItemIf} from "@fnf/fnf-data";
import {PanelIndex} from "../panel-index";

/**
 * Parameters for file operations like copy, move, and rename
 */
export class FileOperationParams {
  constructor(
    public source: FileItemIf,
    public srcPanelIndex: PanelIndex,
    public target: FileItemIf,
    public targetPanelIndex?: PanelIndex,
    public bulk: boolean = false
  ) {
  }
}
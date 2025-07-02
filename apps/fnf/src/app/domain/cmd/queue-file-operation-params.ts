import {FileItemIf, PanelIndex} from "@fnf/fnf-data";

/**
 * Parameters for file operations like copy, move, and rename
 */
export class QueueFileOperationParams {
  constructor(
    public source: FileItemIf,
    public srcPanelIndex: PanelIndex,
    public target: FileItemIf,
    public targetPanelIndex: PanelIndex,
    public bulk: boolean = false
  ) {
  }
}
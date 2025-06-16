import {GotoAnythingOptionData} from "./goto-anything-option.data";

export class GotoAnythingDialogData {

  constructor(
    public firstInput: string = '',
    public dirs: string[] = [],
    public commands: GotoAnythingOptionData[] = [],
    public source: string[] = []
  ) {
  }
}

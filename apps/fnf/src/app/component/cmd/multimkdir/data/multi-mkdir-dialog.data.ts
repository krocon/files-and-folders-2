import {Options} from "./options";
import {MultiMkdirData} from "./multi-mkdir.data";
import {MultiMkdirOptions} from "./multi-mkdir-options";

export class MultiMkdirDialogData {

  data: MultiMkdirData | null = null;
  options: Options = new MultiMkdirOptions();

  constructor(
    public parentDir: string,
    public name: string = "S[C]",
  ) {
  }
}
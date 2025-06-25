import {OptionItem} from "./option.item";

export interface Options {
  digits: OptionItem<number>[];
  starts: OptionItem<number>[];
  steps: OptionItem<number>[];
  capitalizeModes: OptionItem<string>[];
}
import {PanelIndex} from "@fnf-data/src";


export function getOtherPanelIndex(index: PanelIndex): PanelIndex {
  if (index === 0) return 1;
  return 0;
}

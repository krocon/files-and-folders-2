import { ButtonEnableStates, EXP_ZIP_FILE_URL, FileItemIf } from "@fnf/fnf-data";

export function getButtonEnableStates(items: FileItemIf[]): ButtonEnableStates {
  const states = new ButtonEnableStates();
  states.copy = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  states.edit = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  states.move = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  states.remove = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  states.mkdir = true;
  states.rename = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  states.unpack = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
  return states;
}

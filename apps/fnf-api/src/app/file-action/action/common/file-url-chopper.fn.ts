import {DirEvent, FileItem, PanelIndex} from "@fnf-data";
import {DirBaseIf, processFileUrl} from "./url-processor.fn";
import {fileExt} from "./fielext";


/**
 * Processes a file URL to check or add directory events, creating an array of directory events
 * with associated file items for further processing or management.
 *
 * @param {string} url The file URL to be processed.
 * @param {PanelIndex} panelIndex The index of the panel where the directory events are applied.
 * @return {DirEvent[]} An array of DirEvent objects created from the processed file URL.
 */
export function fileUrl2CheckOrAddDirEvents(url: string, panelIndex: PanelIndex) {
  const arr: DirBaseIf[] = processFileUrl(url);

  return arr.map(
    (item, i) => new DirEvent(
      item.dir,
      [new FileItem(item.dir, item.base, i == 0 ? fileExt(item.base) : '', '', 0, true, false)],
      i == 0,
      i === arr.length - 1,
      1,
      "",
      "checkOrAddDir",
      panelIndex)
  );
}
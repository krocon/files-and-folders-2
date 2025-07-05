import {DirEvent, DirEventIf, FileItem, FileItemIf} from "@fnf/fnf-data";
import * as StreamZip from "node-stream-zip";
import * as path from "path";

export async function unpacklist(file: string): Promise<DirEventIf[]> {
  console.log('unpacklist....', JSON.stringify(file)); // TODO delete
  if (!file) {
    throw new Error("Invalid argument exception!");
  }

  const zip = new StreamZip.async({file});
  const entries = await zip.entries();
  console.log(entries); // TODO delete
  const fileItems: FileItemIf[] = [];
  const zipDir = file + ":";
  const dirEvent = new DirEvent(zipDir, fileItems, true, true, fileItems.length, "", "list");

  for (const entry of Object.values(entries)) {
    const entryDir = path.dirname(entry.name);
    const entryBase = path.basename(entry.name);
    if (entry.isDirectory || entry.isFile) {
      let dir = (zipDir + ":/" + entryDir).replace(/::/g, ":");
      if (dir.endsWith("/.")) {
        dir = dir.substring(0, dir.length - 2);
      }
      let fileItem = new FileItem(dir, entryBase, "", "", entry.size, entry.isDirectory, false);
      console.log(fileItem); // TODO delete
      fileItems.push(fileItem);
    }
  }
  await zip.close();
  return [dirEvent];
}

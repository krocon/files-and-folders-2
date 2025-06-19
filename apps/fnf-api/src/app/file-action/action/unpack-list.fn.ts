import {DirEvent, DirEventIf, FileItem, FileItemIf} from "@fnf/fnf-data";
import * as StreamZip from "node-stream-zip";
import * as path from "path";

export async function unpacklist(file: string): Promise<DirEventIf[]> {

  return new Promise<DirEventIf[]>(async (resolve, reject) => {
    if (!file) {
      reject("Invalid argument exception!");
      return;
    }

    try {
      const zip = new StreamZip.async({file});
      const entries = await zip.entries();
      const fileItems: FileItemIf[] = [];
      const zipDir = file + ":";
      const dirEvent = new DirEvent(zipDir, fileItems, true, true, fileItems.length, "", "list");

      for (const entry of Object.values(entries)) {
        const entryDir = path.dirname(entry.name);
        const entryBase = path.basename(entry.name);
        if (entry.isDirectory || entry.isFile) {
          let dir = (zipDir + ":/" + entryDir).replace(/::/g, ":");
          if (dir.endsWith("/.")) {
            dir = dir.substr(0, dir.length - 2);
          }
          fileItems.push(new FileItem(dir, entryBase, "", "", entry.size, entry.isDirectory, false));
        }
      }
      await zip.close();
      resolve([dirEvent]);

    } catch (e) {
      reject(e);
    }
  });
}

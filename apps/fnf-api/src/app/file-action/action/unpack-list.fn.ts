import {DirEvent, DirEventIf, FileItem, FileItemIf} from "@fnf/fnf-data";
import * as StreamZip from "node-stream-zip";
import * as path from "path";

/**
 * Lists the contents of a zip file
 * 
 * This function reads a zip archive and returns a list of all files and directories contained within it.
 * It uses the node-stream-zip library to read the zip file structure without extracting the contents.
 * 
 * The function returns a DirEvent object with action 'list' containing FileItem objects for each entry
 * in the zip file. The directory structure of the zip file is preserved in the returned FileItems.
 * 
 * @param file - The path to the zip file to list
 * @returns A Promise resolving to an array containing a single DirEventIf object with the zip contents
 * @throws Error if the file is invalid or cannot be read
 */
export async function unpacklist(file: string): Promise<DirEventIf[]> {
  //console.log('unpacklist....', JSON.stringify(file)); // TODO delete
  if (!file) {
    throw new Error("Invalid argument exception!");
  }

  const zip = new StreamZip.async({file});
  const entries = await zip.entries();
  //console.log(entries); // TODO delete
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
      //console.log(fileItem); // TODO delete
      fileItems.push(fileItem);
    }
  }
  await zip.close();
  return [dirEvent];
}

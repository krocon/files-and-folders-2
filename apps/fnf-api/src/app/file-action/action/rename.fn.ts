import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";
import {clone} from "./common/clone";

/**
 * Renames a file or directory in the file system
 * 
 * This function renames a file or directory based on the source and target information in the FilePara object.
 * It uses fs-extra's rename function, which works for both files and directories.
 * 
 * After renaming, it returns DirEvent objects that represent the changes made:
 * 1. An 'add' or 'addDir' event to indicate the new name was created
 * 2. An 'unlink' or 'unlinkDir' event to indicate the old name was removed
 * 3. A 'focus' event to focus on the newly renamed item
 * 
 * @param para - The FilePara object containing source (original name) and target (new name) information
 * @returns A Promise resolving to an array of DirEventIf objects representing the changes made
 * @throws Error if the source or target is invalid, if the source doesn't exist, or if the target already exists
 */
export async function rename(para: FilePara): Promise<DirEventIf[]> {
  if (!para || !para.source || !para.target) {
    throw new Error("Invalid argument exception!");
  }
  const ptarget = para.target;
  const psource = para.source;

  const sourceUrl = fixPath(
    path.join(psource.dir, "/", psource.base ? psource.base : "")
  );
  const targetUrl = fixPath(
    path.join(ptarget.dir, "/", ptarget.base ? ptarget.base : "")
  );

  // Check if source exists
  if (!(await fse.pathExists(sourceUrl))) {
    throw new Error(`Source does not exist: ${sourceUrl}`);
  }

  // Check if target already exists
  if (await fse.pathExists(targetUrl)) {
    throw new Error(`Target already exists: ${targetUrl}`);
  }

  await fse.rename(sourceUrl, targetUrl);

  const stats = await fse.stat(targetUrl);
  if (!stats) {
    throw new Error("Could not get stats for target file");
  }

  const targetItem = clone<FileItemIf>(para.target);
  const item1 = new DirEvent(targetItem.dir, [targetItem], false, false, 1, "", targetItem.isDir ? "addDir" : "add");
  const item2 = new DirEvent(psource.dir, [psource], false, false, 1, "", psource.isDir ? "unlinkDir" : "unlink");
  const item3 = new DirEvent(targetItem.dir, [targetItem], false, false, 1, "", "focus");
  return [item1, item2, item3];

}

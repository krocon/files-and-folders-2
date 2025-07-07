import {DirEvent, DirEventIf, FileItem, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";

/**
 * Creates a new directory at the specified location
 * 
 * This function creates a new directory based on the target information in the FilePara object.
 * After creating the directory, it returns DirEvent objects that represent the changes made:
 * 1. An 'addDir' event to indicate the directory was created
 * 2. An 'unselectall' event to clear any selections
 * 3. A 'focus' event to focus on the newly created directory
 * 
 * @param para - The FilePara object containing target information (where to create the directory)
 * @returns A Promise resolving to an array of DirEventIf objects representing the changes made
 * @throws Error if the target is invalid or if the directory creation fails
 */
export async function mkdir(para: FilePara): Promise<DirEventIf[]> {

  if (!para || !para.target) {
    throw new Error("Invalid argument exception! " + JSON.stringify(para));
  }

  const ptarget = para.target;
  const targetUrl = fixPath(
    path.join(ptarget.dir, "/", ptarget.base ? ptarget.base : "")
  );

  // Check if directory already exists
  if (await fse.pathExists(targetUrl)) {
    throw new Error("Directory already exists");
  }

  await fse.ensureDir(targetUrl);
  const stats = await fse.stat(targetUrl);

  if (!stats) {
    throw new Error("Could not get stats for target directory");
  }

  const targetItem = new FileItem(para.target.dir, para.target.base, '', '', 0, true);
  const item1 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "addDir");
  const item2 = new DirEvent(para.target.dir, [], false, false, 1, "", "unselectall");
  const item3 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "focus");
  return [item1, item2, item3];
}

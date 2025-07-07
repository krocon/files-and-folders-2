import * as path from "path";
import * as fse from "fs-extra";
import {DirEvent, DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";

/**
 * Removes a file or directory from the file system
 * 
 * This function deletes a file or directory based on the source information in the FilePara object.
 * It uses fs-extra's remove function, which can handle both files and directories (recursively).
 * 
 * After removing the file or directory, it returns a DirEvent object that represents the change:
 * - For files: An 'unlink' event
 * - For directories: An 'unlinkDir' event
 * 
 * @param para - The FilePara object containing source information (what to remove)
 * @returns A Promise resolving to an array of DirEventIf objects representing the changes made
 * @throws Error if the source is invalid
 */
export async function remove(para: FilePara): Promise<DirEventIf[]> {
  if (!para || !para.source) {
    throw new Error("Invalid argument exception!");
  }

  const psource = para.source;
  const source = fixPath(path.join(psource.dir, "/", psource.base));

  await fse.remove(source);

  const ret: DirEventIf[] = [];
  ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", para.source.isDir ? "unlinkDir" : "unlink"));
  return ret;
}

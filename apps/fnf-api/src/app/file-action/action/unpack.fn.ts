import {DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";

import * as StreamZip from "node-stream-zip";
import * as fse from "fs-extra";

/**
 * Extracts the contents of a zip file to a target directory
 * 
 * This function extracts all files and directories from a zip archive based on the source and target 
 * information in the FilePara object. It uses the node-stream-zip library to handle the extraction.
 * 
 * The source parameter specifies the zip file to extract, and the target parameter specifies 
 * the directory where the contents should be extracted to.
 * 
 * @param para - The FilePara object containing source (zip file) and target (extraction directory) information
 * @returns A Promise resolving to an empty array of DirEventIf objects
 * @throws Error if the source or target is invalid, or if the extraction fails
 */
export async function unpack(para: FilePara): Promise<DirEventIf[]> {
  if (!para || !para.source || !para.target) {
    throw new Error("Invalid argument exception!");
  }
  const ptarget = para.target;
  const psource = para.source;

  const sourceUrl = fixPath(
    path.join(psource.dir, "/", psource.base ? psource.base : "")
  );
  const targetUrl = fixPath(
    path.join(ptarget.dir, ptarget.base ? ptarget.base : "")
  );

  fse.ensureDirSync(targetUrl);

  const zip = new StreamZip.async({file: sourceUrl});
  await zip.extract(null, targetUrl);
  await zip.close();
  return [];
}

import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";
import {clone} from "./common/clone";

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

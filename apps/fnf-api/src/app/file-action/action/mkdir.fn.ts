import {DirEvent, DirEventIf, FileItem, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";


export async function mkdir(para: FilePara): Promise<DirEventIf[]> {

  if (!para || !para.target) {
    throw new Error("Invalid argument exception! " + JSON.stringify(para));
  }

  const ptarget = para.target;
  const targetUrl = fixPath(
    path.join(ptarget.dir, "/", ptarget.base ? ptarget.base : "")
  );

  await fse.mkdir(targetUrl);
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

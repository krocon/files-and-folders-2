import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";
import {clone} from "./common/clone";


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

  const targetItem = clone<FileItemIf>(para.target);
  const item1 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "addDir");
  const item2 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "select");
  return [item1, item2];
}

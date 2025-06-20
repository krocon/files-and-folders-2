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
  const item1 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", targetItem.isDir ? "addDir" : "add");
  const item2 = new DirEvent(para.source.dir, [para.source], false, false, 1, "", para.source.isDir ? "addDir" : "add");
  const ret: DirEventIf[] = [item1, item2];
  return ret;

  // var msg = {
  //   changedir: 'created',
  //   panelIndex:action.panelIndex,
  //   item: {dir: action.target.dir, base: slash.fixPath(action.target.base)}
  // };
  // if (stats) {
  //   msg.item.size = stats.isDirectory() ? null : stats.size;
  //   msg.item.date = stats.atime;
  //   msg.item.isDir = stats.isDirectory();
  // }
  //
  // var back = {
  //   events: [
  //     {
  //       changedir: 'removed',
  //       panelIndex: action.panelIndex,
  //       item: action.src
  //     },
  //     msg,
  //     {
  //       changedir: 'focus',
  //       panelIndex: action.panelIndex,
  //       item: action.target
  //     }
  //   ],
  //   error: null
  // };
}

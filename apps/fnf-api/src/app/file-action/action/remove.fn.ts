import * as path from "path";
import * as fse from "fs-extra";
import {DirEvent, DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";

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

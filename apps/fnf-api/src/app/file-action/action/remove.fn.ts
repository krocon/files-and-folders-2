import * as path from "path";
import * as fse from "fs-extra";
import {DirEvent, DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";

export function remove(para: FilePara): Promise<DirEventIf[]> {
  return new Promise<DirEventIf[]>((resolve, reject) => {
    if (!para || !para.source) {
      reject("Invalid argument exception!");
      return;
    }
    const psource = para.source;
    const source = fixPath(path.join(psource.dir, "/", psource.base));
    const ret: DirEventIf[] = [];
    fse.remove(source, (error) => {
      if (error) {
        reject(error);
      } else {
        ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", para.source.isDir ? "unlinkDir" : "unlink"));
        resolve(ret);
      }
    });
  });
}

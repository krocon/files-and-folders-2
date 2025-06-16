import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";
import * as fse from "fs-extra";
import {clone} from "./common/clone";


export function mkdir(para: FilePara): Promise<DirEventIf[]> {

  return new Promise<DirEventIf[]>((resolve, reject) => {
    if (!para || !para.target) {
      reject("Invalid argument exception! " + JSON.stringify(para));
      return;
    }
    const ptarget = para.target;
    const targetUrl = fixPath(
      path.join(ptarget.dir, "/", ptarget.base ? ptarget.base : "")
    );

    fse.mkdir(targetUrl, (error) => {
      if (error) {
        reject(error);
      } else {
        fse.stat(targetUrl, (error, stats) => {
          if (error || !stats) {
            reject(error);
          } else {
            const targetItem = clone<FileItemIf>(para.target);
            const item1 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "addDir");
            const item2 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", "select");
            const ret: DirEventIf[] = [item1, item2];
            resolve(ret);
          }
        });
      }
    });
  });
}

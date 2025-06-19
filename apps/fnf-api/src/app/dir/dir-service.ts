import {Injectable} from "@nestjs/common";
import {Config, DirEvent, DirEventIf, DirPara, FileItem, fixPath, getZipUrlInfo, isZipUrl} from "@fnf/fnf-data";

import * as fs from "fs-extra";
import * as path from "path";
import {stats2FileItem} from "./stats-to-file";
import {unpacklist} from "../file-action/action/unpack-list.fn";

@Injectable()
export class DirService {

  static config: Config = new Config();

  readdir(para: DirPara): Promise<DirEvent[]> {
    const p = para.path;

    if (DirService.config.dockerRoot === p && DirService.config.containerPaths) {
      return new Promise<DirEventIf[]>((resolve, reject) => {
        const fileItems = DirService.config
          .containerPaths
          .map(s => {
            const base = fixPath(s.replace(p, ''))
              .replace(/^\//g, '');
            const fileItem = new FileItem(p, base, path.extname(base), null, 0, true);
            this.addStats2FileItem(fileItem);
            return fileItem;
          });
        resolve([new DirEvent(p, fileItems, true, true, fileItems.length, "", "list")]);
      });
    }

    if (isZipUrl(p)) {
      const zipUrlInfo = getZipUrlInfo(p);

      return new Promise<DirEventIf[]>((resolve, reject) => {
        unpacklist(zipUrlInfo.zipUrl)
          .then(dirEvents => {
            return resolve(dirEvents);
          }, error => reject(error));
      });

    } else {
      return new Promise<DirEventIf[]>((resolve, reject) => {

        const fileItems: FileItem[] = [];
        try {
          if (fs.existsSync(p)) {
            const files = fs.readdirSync(p);
            for (let idx = 0; idx < files.length; idx++) {
              const f = files[idx];

              const fileItem = new FileItem(
                p,
                fixPath(f),
                path.extname(f),
              );
              fileItems.push(fileItem);
              this.addStats2FileItem(fileItem);

            } // for
            resolve([new DirEvent(p, fileItems, true, true, fileItems.length, "", "list")]);

          } else {
            resolve([new DirEvent(p, fileItems, true, true, fileItems.length, "Error: Folder does not exist: " + p, "list")]);
          }

        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    }
  }

  private addStats2FileItem(fileItem: FileItem): void {
    const ff = path.join(fileItem.dir, "/", fileItem.base);
    try {
      const stats = fs.statSync(ff);
      stats2FileItem(stats, fileItem);

    } catch (e) {
      if (!fileItem.meta) fileItem.meta = {};
      fileItem.meta.error = e;
      console.info("DirGateWay() stats error:", e.message);
    }
  }

}

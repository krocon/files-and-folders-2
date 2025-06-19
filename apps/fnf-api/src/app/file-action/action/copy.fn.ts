import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import {exec} from "child_process";
import {slash2backSlash} from "./common/slash-2-backslash.fn";
import {clone} from "./common/clone";
import {Logger} from "@nestjs/common";

const platform = os.platform();
const osx = platform === "darwin";
const windows = platform.indexOf("win") === 0;
const linux = platform.indexOf("linux") === 0;

const logger = new Logger("fn-copy");

export function copy(para: FilePara): Promise<DirEventIf[]> {


  function createRet(targetUrl: string, para: FilePara): DirEventIf[] {
    const item = clone<FileItemIf>(para.source);
    item.dir = targetUrl;
    const ret: DirEventIf[] = [];
    ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", "unselect"));
    ret.push(new DirEvent(targetUrl, [item], false, false, 1, "", item.isDir ? "addDir" : "add"));
    return ret;
  }

  return new Promise<DirEventIf[]>((resolve, reject) => {
    if (!para || !para.source || !para.target) {
      reject("Invalid argument exception!");
      return;
    }
    const ptarget = para.target;
    const psource = para.source;

    const sourceUrl = fixPath(
      path.join(psource.dir, "/", psource.base ? psource.base : "")
    );
    const targetUrl = fixPath(
      path.join(ptarget.dir, "/", ptarget.base ? ptarget.base : "")
    );

    fse.stat(sourceUrl, (error, stats) => {
      if (!stats) {
        reject(error);
        return;
      }
      const sourceIsDirectory = stats.isDirectory(); // source only, target not exists!
      const targetMkdir = sourceIsDirectory ? targetUrl : ptarget.dir;

      fse.mkdirs(targetMkdir, (error) => {
        if (error) {
          reject(error);
          return;
        }

        let cmd;
        if (osx) {
          // cp -r "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
          // cp -r "/Users/marc/__test/src/a" "/Users/marc/__test/target"
          cmd = "cp -r \"" + sourceUrl + "\" \"" + ptarget.dir + "\"";

        } else if (windows) {
          const src = slash2backSlash(sourceUrl);
          if (sourceIsDirectory) {
            // xcopy  "C:\Users\kronmar\bbbbb\marc\a" "C:\Users\kronmar\bbbbb\marc2\a\" /E /C /I /H /R /Y
            const t1 = slash2backSlash(ptarget.dir + "/" + psource.base + "/");
            cmd = `xcopy  "${src}" "${t1}" /E /C /I /H /R /Y `;

          } else {
            // xcopy  "C:\Users\kronmar\bbbbb\marc\zipEntries.js" "C:\Users\kronmar\bbbbb\marc2" /Y
            const td = slash2backSlash(ptarget.dir);
            cmd = `xcopy  "${src}" "${td}" /Y `;
          }

        } else if (linux) {
          if (sourceIsDirectory) {
            // dir to dir:
            // rsync -avzh /root/rpmpkgs /tmp/backups/
            cmd = `rsync -avzh "${sourceUrl}" "${targetUrl}"`;
          } else {
            // file to dir:
            // rsync -zvh backup.tar.gz /tmp/backups/
            cmd = `rsync -zvh "${sourceUrl}" "${targetUrl}"`;
          }

        }

        logger.log("cmd: " + cmd);

        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            logger.error(error);
            // zweiter Versuch:
            const to = path.join(targetUrl, "/", para.source.base);
            fse.copy(sourceUrl, to, (error) => {
              if (error) {
                logger.error(error);
                reject(error);
              } else {
                const ret = createRet(targetUrl, para);
                resolve(ret);
              }
            });
          } else {
            const ret = createRet(targetUrl, para);
            resolve(ret);
          }
        });
      });
    });
  });


}

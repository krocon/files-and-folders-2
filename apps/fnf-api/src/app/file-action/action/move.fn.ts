import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import {exec} from "child_process";
import {slash2backSlash} from "./common/slash-2-backslash.fn";
import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import {Logger} from "@nestjs/common";

const platform = os.platform();
const osx = platform === "darwin";
const windows = platform.indexOf("win") === 0;
const linux = platform.indexOf("linux") === 0;

const logger = new Logger("fn-move");

export function move(para: FilePara): Promise<DirEventIf[]> {

  function createRet(targetUrl: string, para: FilePara): DirEventIf[] {
    const ret: DirEventIf[] = [];
    const isDir = para.source.isDir;
    ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", isDir ? "unlinkDir" : "unlink"));
    ret.push(new DirEvent(targetUrl, [{
      ...para.source,
      dir: targetUrl
    }], false, false, 1, "", isDir ? "addDir" : "add"));
    return ret;
  }


  return new Promise<DirEventIf[]>((resolve, reject) => {
    if (!para || !para.source || !para.target) {
      reject("Invalid argument exception!");
      return;
    }
    const ptarget: FileItemIf = para.target;
    const psource: FileItemIf = para.source;

    const source:string = fixPath(path.join(psource.dir, "/", psource.base));
    const target:string = fixPath(path.join(ptarget.dir, "/", ptarget.base));

    fse.stat(source, (error, stats) => {
      const sourceIsDirectory = stats.isDirectory(); // source only, target not exists!
      const targetMkdir = sourceIsDirectory ? target : ptarget.dir;

      fse.mkdirs(targetMkdir, (error) => {
        if (error) {
          reject(error);
          return;
        }

        let cmd;
        //const t = target;
        if (osx) {
          // cmd mv "/Users/marc/__test/src/a" "/Users/marc/__test/target"
          // cmd mv "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
          cmd = "mv \"" + source + "\" \"" + ptarget.dir + "\"";

        } else if (windows) {

          const bsTargetDir = slash2backSlash(ptarget.dir);
          if (psource.isDir) {
            // robocopy "test\demo\a1" ".\test\demo\mkdir1\a1" /e /move
            let bsSource = `${slash2backSlash(source)}`;
            cmd = `robocopy  "${bsSource}" "${bsTargetDir}" /e /move`;
          } else {
            const bsSourceDir = slash2backSlash(psource.dir);
            cmd = `robocopy  "${bsSourceDir}" "${bsTargetDir}" ${psource.base}  /move`;
          }

        } else if (linux) {
          if (sourceIsDirectory) {
            // dir to dir:
            // rsync -avzh /root/rpmpkgs /tmp/backups/
            cmd = `rsync --remove-source-files -avzh "${source}" "${target}"`;
          } else {
            // file to dir:
            // rsync -zvh backup.tar.gz /tmp/backups/
            cmd = `rsync --remove-source-files -zvh "${source}" "${target}"`;
          }
        }

        logger.log("cmd: " + cmd);

        exec(cmd, (error, stdout, stderr) => {
          const realError = stdout?.match(
            /[\s\S]*----[\s\S]*(ERROR\s*:?\s*[\s\S]*?)(Simple Usage|$)/
          );

          //const item1 = new DirEvent(para.source.dir, [para.source], false, false, 1, "", para.source.isDir ? "unlinkDir" : "unlink");
          //const targetItem = clone<FileItemIf>(para.target);
          //const item2 = new DirEvent(para.target.dir, [targetItem], false, false, 1, "", para.source.isDir ? "addDir" : "add");
          //const ret: DirEventIf[] = [item1, item2];

          if (realError) {
            logger.error(realError);
            // zweiter Versuch:
            fse.move(source, target, (error) => {
              if (error) {
                logger.error(error);
                reject(error);
              } else {
                const ret = createRet(target, para);
                resolve(ret);
              }
            });
          } else {
            const ret = createRet(target, para);
            resolve(ret);
          }
        });
      });
    });
  });

}

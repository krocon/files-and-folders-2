import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import {slash2backSlash} from "./common/slash-2-backslash.fn";
import {clone} from "./common/clone";
import {Logger} from "@nestjs/common";
import {executeCommand} from "./common/execute-command";

const platform = os.platform();
const osx = platform === "darwin";
const windows = platform.indexOf("win") === 0;
const linux = platform.indexOf("linux") === 0;

const logger = new Logger("fn-copy");

export async function copy(para: FilePara): Promise<DirEventIf[]> {


  function createRet(targetUrl: string, para: FilePara): DirEventIf[] {
    const item = clone<FileItemIf>(para.source);
    item.dir = targetUrl;
    const ret: DirEventIf[] = [];
    ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", "unselect"));
    ret.push(new DirEvent(targetUrl, [item], false, false, 1, "", item.isDir ? "addDir" : "add"));
    return ret;
  }

  function getCmd(
    osx: boolean,
    windows: boolean,
    linux: boolean,
    sourceUrl: string,
    targetUrl: string,
    sourceIsDirectory: boolean,
    ptarget: FileItemIf,
    psource: FileItemIf
  ): string {
    if (osx) {
      // cp -r "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
      // cp -r "/Users/marc/__test/src/a" "/Users/marc/__test/target"
      return "cp -r \"" + sourceUrl + "\" \"" + ptarget.dir + "\"";

    } else if (windows) {
      const src = slash2backSlash(sourceUrl);
      if (sourceIsDirectory) {
        // xcopy  "C:\Users\kronmar\bbbbb\marc\a" "C:\Users\kronmar\bbbbb\marc2\a\" /E /C /I /H /R /Y
        const t1 = slash2backSlash(ptarget.dir + "/" + psource.base + "/");
        return `xcopy  "${src}" "${t1}" /E /C /I /H /R /Y `;

      } else {
        // xcopy  "C:\Users\kronmar\bbbbb\marc\zipEntries.js" "C:\Users\kronmar\bbbbb\marc2" /Y
        const td = slash2backSlash(ptarget.dir);
        return `xcopy  "${src}" "${td}" /Y `;
      }

    } else if (linux) {
      if (sourceIsDirectory) {
        // dir to dir:
        // rsync -avzh /root/rpmpkgs /tmp/backups/
        return `rsync -avzh "${sourceUrl}" "${targetUrl}"`;
      } else {
        // file to dir:
        // rsync -zvh backup.tar.gz /tmp/backups/
        return `rsync -zvh "${sourceUrl}" "${targetUrl}"`;
      }
    }
  }


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

  const stats = await fse.stat(sourceUrl);
  if (!stats) {
    throw new Error("Could not get stats for source file");
  }

  const sourceIsDirectory = stats.isDirectory(); // source only, target not exists!
  const targetMkdir = sourceIsDirectory ? targetUrl : ptarget.dir;

  await fse.mkdirs(targetMkdir);

  const cmd = getCmd(osx, windows, linux, sourceUrl, targetUrl, sourceIsDirectory, ptarget, psource);
  logger.log("cmd: " + cmd);

  try {
    await executeCommand(cmd);
    return createRet(targetUrl, para);

  } catch (error) {
    // second try:
    logger.error(error);
    const to = path.join(targetUrl, "/", para.source.base);
    await fse.copy(sourceUrl, to);
    return createRet(targetUrl, para);
  }

}

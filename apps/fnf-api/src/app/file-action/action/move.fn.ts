import {DirEvent, DirEventIf, FileItem, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import {slash2backSlash} from "./common/slash-2-backslash.fn";
import {clone} from "./common/clone";
import {Logger} from "@nestjs/common";
import {executeCommand} from "./common/execute-command";
import {fileExt} from "./common/fielext";
import {processFileUrl} from "./common/url-processor.fn";

const platform = os.platform();
const osx = platform === "darwin";
const windows = platform.indexOf("win") === 0;
const linux = platform.indexOf("linux") === 0;

const logger = new Logger("fn-move");

export async function move(para: FilePara): Promise<DirEventIf[]> {

  function createRet(targetUrl: string, para: FilePara): DirEventIf[] {
    const item = clone<FileItemIf>(para.source);
    const targetDir = path.dirname(targetUrl);
    item.dir = targetDir;
    const ret: DirEventIf[] = [];
    const isDir = para.source.isDir;

    ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", isDir ? "unlinkDir" : "unlink", para.sourcePanelIndex));
    ret.push(new DirEvent(targetDir, [item], false, false, 1, "", isDir ? "addDir" : "add", para.targetPanelIndex));

    const arr: {url:string, base:string}[] = processFileUrl(targetDir);
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      ret.push(new DirEvent(
        item.url,
        [new FileItem(item.url, item.base, i==0 ? fileExt(item.base): '', '', 0, true, false)],
        i==0,
        i ===arr.length-1,
        1,
        "",
        "checkOrAddDir",
        para.targetPanelIndex));
    }
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
      // cmd mv "/Users/marc/__test/src/a" "/Users/marc/__test/target"
      // cmd mv "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
      return "mv \"" + sourceUrl + "\" \"" + ptarget.dir + "\"";

    } else if (windows) {
      const bsTargetDir = slash2backSlash(ptarget.dir);
      if (psource.isDir) {
        // robocopy "test\demo\a1" ".\test\demo\mkdir1\a1" /e /move
        let bsSource = `${slash2backSlash(sourceUrl)}`;
        return `robocopy  "${bsSource}" "${bsTargetDir}" /e /move`;
      } else {
        const bsSourceDir = slash2backSlash(psource.dir);
        return `robocopy  "${bsSourceDir}" "${bsTargetDir}" ${psource.base}  /move`;
      }

    } else if (linux) {
      if (sourceIsDirectory) {
        // dir to dir:
        // rsync -avzh /root/rpmpkgs /tmp/backups/
        return `rsync --remove-source-files -avzh "${sourceUrl}" "${targetUrl}"`;
      } else {
        // file to dir:
        // rsync -zvh backup.tar.gz /tmp/backups/
        return `rsync --remove-source-files -zvh "${sourceUrl}" "${targetUrl}"`;
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
    await fse.move(sourceUrl, to);
    return createRet(targetUrl, para);
  }

}

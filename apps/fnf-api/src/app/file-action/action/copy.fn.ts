import {DirEvent, DirEventIf, FileItemIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import {slash2backSlash} from "./common/slash-2-backslash.fn";
import {clone} from "./common/clone";
import {Logger} from "@nestjs/common";
import {executeCommand} from "./common/execute-command";
import {fileUrl2CheckOrAddDirEvents} from "./common/file-url-chopper.fn";

const platform = os.platform();
const osx = platform === "darwin";
const windows = platform.indexOf("win") === 0;
const linux = platform.indexOf("linux") === 0;

const logger = new Logger("fn-copy");

/**
 * Copies a file or directory from source to target location
 * 
 * This function handles copying files and directories across different platforms (Windows, macOS, Linux)
 * using native commands when possible, with a fallback to fs-extra's copy function.
 * 
 * For files, it copies the file to the target directory.
 * For directories, it recursively copies the directory and its contents to the target directory.
 * 
 * @param para - The FilePara object containing source and target information
 * @returns A Promise resolving to an array of DirEventIf objects representing the changes made
 * @throws Error if the source or target is invalid, or if the copy operation fails
 */
export async function copy(para: FilePara): Promise<DirEventIf[]> {


  function createRet(targetDir:string, targetUrl: string, para: FilePara): DirEventIf[] {
    const item = clone<FileItemIf>(para.source);
    item.dir = targetUrl;
    item.abs = false;
    const ret: DirEventIf[] = fileUrl2CheckOrAddDirEvents(targetUrl, para.targetPanelIndex);
    ret.push(new DirEvent(para.source.dir, [para.source], false, false, 1, "", "unselect"));
    ret.push(new DirEvent(targetDir, [item], false, false, 1, "", item.isDir ? "addDir" : "add"));
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
    // Use spawn with a reasonable timeout for large file operations
    // The timeout is longer for directories or when the source file is large
    const fileSize = sourceIsDirectory ? 0 : stats.size;
    const isLargeFile = fileSize > 100 * 1024 * 1024; // 100MB threshold
    const timeout = sourceIsDirectory || isLargeFile ? 3600000 : 300000; // 1 hour for large files/dirs, 5 minutes otherwise

    logger.log(`Moving ${sourceIsDirectory ? 'directory' : 'file'} of size ${fileSize} bytes with timeout ${timeout}ms`);

    await executeCommand(cmd, {
      useSpawn: osx,
      timeout: timeout
    });

    return createRet(ptarget.dir, targetUrl, para);

  } catch (error) {
    // second try:
    logger.error(error);
    const to = path.join(targetUrl, "/", para.source.base);
    await fse.copy(sourceUrl, to);
    return createRet(ptarget.dir, targetUrl, para);
  }

}

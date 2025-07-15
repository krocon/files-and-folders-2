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

const logger = new Logger("fn-move");

/**
 * Moves a file or directory from source to target location
 * 
 * This function handles moving files and directories across different platforms (Windows, macOS, Linux)
 * using native commands when possible, with a fallback to fs-extra's move function.
 * 
 * For files, it moves the file to the target directory.
 * For directories, it recursively moves the directory and its contents to the target directory.
 * 
 * Platform-specific commands:
 * - macOS: Uses 'mv' command
 * - Windows: Uses 'robocopy' with different parameters for files and directories
 * - Linux: Uses 'rsync' with --remove-source-files flag
 * 
 * @param para - The FilePara object containing source and target information
 * @returns A Promise resolving to an array of DirEventIf objects representing the changes made
 * @throws Error if the source or target is invalid, or if the move operation fails
 */
export async function move(para: FilePara): Promise<DirEventIf[]> {

  function createRet(para: FilePara, targetUrl:string): DirEventIf[] {
    const isDir = para.source.isDir;
    const targetItem = {...clone<FileItemIf>(para.source), dir: targetUrl, abs:false};

    const ret: DirEventIf[] = fileUrl2CheckOrAddDirEvents(para.target.dir, para.targetPanelIndex);
    ret.push(new DirEvent(para.source.dir, [para.source], true, true, 1, "", isDir ? "unlinkDir" : "unlink", para.sourcePanelIndex));
    ret.push(new DirEvent(para.target.dir, [targetItem], true, true, 1, "", isDir ? "addDir" : "add", para.targetPanelIndex));
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
    throw new Error("Could not get stats for the source file");
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

    return createRet(para, targetUrl);

  } catch (error) {
    return fallbackMove(error, sourceUrl, targetUrl, para);
  }

  async function fallbackMove(error: Error, sourceUrl: string, targetUrl: string, para: FilePara): Promise<DirEventIf[]> {
    logger.error(error);
    const targetPath = path.join(targetUrl, "/", para.source.base);
    await fse.move(sourceUrl, targetPath);
    return createRet(para, targetUrl);
  }

}

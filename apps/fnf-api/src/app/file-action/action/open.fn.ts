import * as path from "path";
import {DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as os from "os";
import {Logger} from "@nestjs/common";
import {executeCommand} from "./common/execute-command";

const logger = new Logger("fn-open");

/**
 * Executes a command with a fallback option if the first command fails
 * 
 * @param cmd - The primary command to execute
 * @param cmdAlternate - The fallback command to execute if the primary command fails
 * @returns A Promise resolving to an empty array of DirEventIf objects
 * @throws Error if both commands fail or if no command is provided
 */
async function execute(
  cmd: string,
  cmdAlternate: string
): Promise<DirEventIf[]> {
  if (!cmd) {
    throw new Error("No command provided");
  }

  try {
    await executeCommand(cmd);
    return [];
  } catch (error) {
    // Second try:
    logger.log("The first command failed, trying alternate command");
    try {
      await executeCommand(cmdAlternate);
      return [];
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Opens a file with the system's default application
 * 
 * This function opens a file based on the source information in the FilePara object.
 * It uses platform-specific commands to open the file:
 * - Windows: Uses 'start' command
 * - macOS: Uses 'open' command
 * - Linux: Tries 'evince' first, then falls back to 'kpdf' if evince fails
 * 
 * @param para - The FilePara object containing source information (file to open)
 * @returns A Promise resolving to an empty array of DirEventIf objects
 * @throws Error if the source is invalid or if the file cannot be opened
 */
export async function open(para: FilePara): Promise<DirEventIf[]> {
  if (!para || !para.source) {
    throw new Error("Invalid argument exception!");
  }

  const psource = para.source;
  const source = fixPath(path.join(psource.dir, "/", psource.base));

  const platform = os.platform();
  const osx = platform === "darwin";
  const linux = platform.indexOf("linux") === 0;
  const windows = platform.indexOf("win") === 0;

  let cmd;
  let cmdAlternate = "";
  if (windows) {
    // http://stackoverflow.com/questions/12010103/launch-a-program-from-command-line-without-opening-a-new-window
    cmd = " start \"\" /max \"" + source + "\" ";

  } else if (osx) {
    cmd = " open \"" + source + "\" ";

  } else if (linux) {
    cmd = "evince -f \"" + source + "\" ";
    cmdAlternate = "kpdf \"" + source + "\" ";

  } else {
    throw new Error("open file-content is not supported for this system.");
  }

  logger.log(`Opening file: ${source}`);
  return await execute(cmd, cmdAlternate);

  // open PDF:
  //
  // W i n d o w s :
  // http://stackoverflow.com/questions/6557920/how-to-open-a-pdf-in-fullscreen-view-via-command-line
  // var cmd = ' start "" /max "h:\\docs\\allg\\ZEISS Lisa\\AT-LISA-tri-family-Datasheet-DE.pdf" ';
  //
  // M a c   O S   X
  // 'open h:\\docs\\allg\\ZEISS Lisa\\AT-LISA-tri-family-Datasheet-DE.pdf'
  //
  // g n o m e   d e s k t o p :
  // https://help.gnome.org/users/evince/stable/commandline.html.en
  // http://stackoverflow.com/questions/264395/linux-equivalent-of-the-mac-os-x-open-command
  // evince -f file-content.pdf
  //
  // K D E   d e s k t o p :
  //  kpdf file-content.pdf
  //
  // TODO   siehe D:\repos\node-files-and-folders-server\lib\socket\cmd\open.js
  // fse.remove(source, function(error) {
  //   if (error) {
  //     ret.error = error;
  //     reject(ret);
  //   } else {
  //     console.log('remove done: ' + source, error);
  //   resolve(new DoEvent(para.source, para.target, para.cmd, error?.message));
  // }
  // });
}

import * as path from "path";
import {DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";
import {exec} from "child_process";
import * as os from "os";

const platform = os.platform();
const osx = platform === "darwin";
const linux = platform.indexOf("linux") === 0;
const windows = platform.indexOf("win") === 0;


function execute(
  cmd: string,
  cmdAlternate: string
): Promise<string> {

  return new Promise<string>((resolve, reject) => {
    if (!cmd) {
      reject("Invalid argument exception!");
      return;
    }
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        // Second try:
        exec(cmdAlternate, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve("ok");
          }
        });
      } else {
        resolve("ok");
      }
    });
  });
}

export function open(para: FilePara): Promise<DirEventIf[]> {

  return new Promise<DirEventIf[]>((resolve, reject) => {
    const psource = para.source;
    const source = fixPath(path.join(psource.dir, "/", psource.base));


    let cmd;
    let cmdAlternate;
    if (windows) {
      // http://stackoverflow.com/questions/12010103/launch-a-program-from-command-line-without-opening-a-new-window
      cmd = " start \"\" /max \"" + source + "\" ";
    } else if (osx) {
      cmd = " open  \"" + source + "\" ";
    } else if (linux) {
      cmd = "evince -f \"" + source + "\" ";
      cmdAlternate = "kpdf \"" + source + "\" ";
    } else {
      reject("open file-content not supported for system.");
      return;
    }

    execute(cmd, cmdAlternate);

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
  });
}

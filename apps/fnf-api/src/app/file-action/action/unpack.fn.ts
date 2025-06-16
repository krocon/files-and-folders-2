import {FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";

import * as StreamZip from "node-stream-zip";
import * as fse from "fs-extra";

export function unpack(para: FilePara): Promise<number> {
  return new Promise<number>((resolve, reject) => {
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

    fse.ensureDirSync(targetUrl);

    const zip = new StreamZip.async({file: sourceUrl});
    zip.extract(null, targetUrl).then(async count => {
      await zip.close();
      resolve(count);
    });
  });
}

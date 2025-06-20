import {DirEventIf, FilePara, fixPath} from "@fnf/fnf-data";
import * as path from "path";

import * as StreamZip from "node-stream-zip";
import * as fse from "fs-extra";

export async function unpack(para: FilePara): Promise<DirEventIf[]> {
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

  fse.ensureDirSync(targetUrl);

  const zip = new StreamZip.async({file: sourceUrl});
  await zip.extract(null, targetUrl);
  await zip.close();
  return [];
}

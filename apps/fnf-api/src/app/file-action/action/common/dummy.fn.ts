import {DoEventIf, FilePara} from "@fnf/fnf-data";


export function dummy(para: FilePara): Promise<DoEventIf> {
  return new Promise<DoEventIf>((resolve, reject) => {
    reject("Error: Unknown cmd: " + para.cmd);
  });
}

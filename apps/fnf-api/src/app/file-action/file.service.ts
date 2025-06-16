import {Injectable} from "@nestjs/common";
import {copy} from "./action/copy.fn";
import {move} from "./action/move.fn";
import {mkdir} from "./action/mkdir.fn";
import {remove} from "./action/remove.fn";
import {rename} from "./action/rename.fn";
import {open} from "./action/open.fn";
import {unpack} from "./action/unpack.fn";
import {dummy} from "./action/common/dummy.fn";
import {DirEventIf, FileCmd, FilePara} from "@fnf/fnf-data";
import {unpacklist} from "./action/unpack-list.fn";


@Injectable()
export class FileService {

  copy = copy.bind(this); // Promise<DirEventIf[]>
  move = move.bind(this); // Promise<DirEventIf[]>
  mkdir = mkdir.bind(this); // Promise<DirEventIf[]>
  remove = remove.bind(this); // Promise<DirEventIf[]>
  rename = rename.bind(this); // Promise<DirEventIf[]>

  open = open.bind(this);  // Promise<string>
  unpack = unpack.bind(this); // Promise<number>
  unpacklist = unpacklist.bind(this); // Promise<DirEventIf>

  dummy = dummy.bind(this);

  getFunctionByCmd(cmd: FileCmd): (para: FilePara) => Promise<DirEventIf[] | DirEventIf | string | number> {
    if (cmd === "copy") return this.copy;
    if (cmd === "move") return this.move;
    if (cmd === "mkdir") return this.mkdir;
    if (cmd === "remove") return this.remove;
    if (cmd === "rename") return this.rename;

    if (cmd === "open") return this.open;
    if (cmd === "unpack") return this.unpack;
    if (cmd === "unpacklist") return this.unpacklist;

    return this.dummy;
  }


}

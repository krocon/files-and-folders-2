import {Injectable} from "@nestjs/common";
import {copy} from "./action/copy.fn";
import {move} from "./action/move.fn";
import {mkdir} from "./action/mkdir.fn";
import {remove} from "./action/remove.fn";
import {rename} from "./action/rename.fn";
import {open} from "./action/open.fn";
import {unpack} from "./action/unpack.fn";
import {dummy} from "./action/common/dummy.fn";
import {FileCmd, FilePara, OnDoResponseType} from "@fnf/fnf-data";
import {unpacklist} from "./action/unpack-list.fn";

/**
 * Service responsible for handling file system operations in the application.
 * This service provides a unified interface for various file operations like copy, move,
 * mkdir, remove, rename, open, unpack, and listing unpacked contents.
 *
 * Each operation is bound to the service instance and returns a Promise of DirEventIf[]
 * which represents the changes made to the file system.
 */
@Injectable()
export class FileService {

  copy = copy.bind(this); // Promise<DirEventIf[]>
  move = move.bind(this); // Promise<DirEventIf[]>
  mkdir = mkdir.bind(this); // Promise<DirEventIf[]>
  remove = remove.bind(this); // Promise<DirEventIf[]>
  rename = rename.bind(this); // Promise<DirEventIf[]>

  /** Opens files with system default application */
  open = open.bind(this);  // Promise<DirEventIf[]>

  /** Extracts compressed archives */
  unpack = unpack.bind(this); // Promise<DirEventIf[]>

  /** Lists contents of compressed archives */
  unpacklist = unpacklist.bind(this); // Promise<DirEventIf[]>

  /** Fallback function for unsupported commands */
  dummy = dummy.bind(this);

  /**
   * Returns the appropriate file operation function based on the provided command.
   *
   * @param cmd - The file operation command to execute
   * @returns A function that takes FilePara parameters and returns a Promise of OnDoResponseType
   * If the command is not supported, returns the dummy function
   */
  getFunctionByCmd(cmd: FileCmd): (para: FilePara) => Promise<OnDoResponseType> {
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

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
 * Type definition for file operation functions
 */
type FileOperationFunction = (para: FilePara) => Promise<OnDoResponseType>;

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
   * Map of file commands to their corresponding functions
   * This provides a more maintainable way to map commands to functions
   * compared to a series of if statements
   */
  private readonly commandMap: Record<FileCmd, FileOperationFunction> = {
    copy: this.copy,
    move: this.move,
    mkdir: this.mkdir,
    remove: this.remove,
    rename: this.rename,
    open: this.open,
    unpack: this.unpack,
    unpacklist: this.unpacklist,
    walk: this.dummy // Default for 'walk' command
  };

  /**
   * Returns the appropriate file operation function based on the provided command.
   *
   * @param cmd - The file operation command to execute
   * @returns A function that takes FilePara parameters and returns a Promise of OnDoResponseType
   * If the command is not supported, returns the dummy function
   */
  getFunctionByCmd(cmd: FileCmd): FileOperationFunction {
    return this.commandMap[cmd] || this.dummy;
  }
}

import {Injectable} from "@nestjs/common";
import * as os from "os";
import * as process from "process";

import {exec} from "child_process";
import {from, Observable} from "rxjs";
import {Sysinfo, SysinfoIf} from "@fnf/fnf-data";
import {SysInfoCallbackFn} from "./sysInfo-callback.fn";

const env = process.env;
const FNF_START_PATH = env.FNF_START_PATH;
const FNF_CONTAINER_PATHS = env.FNF_CONTAINER_PATHS;
const platform = os.platform();

/**
 * @class SysinfoService
 * @description A service that provides system information about the host machine.
 * This injectable service offers methods to retrieve system details such as OS type,
 * platform, architecture, user information, and directory paths.
 */
@Injectable()
export class SysinfoService {
  /** Cached system information to avoid redundant system calls */
  private systemInfo: SysinfoIf;

  /**
   * Retrieves detailed system information asynchronously using a callback pattern
   *
   * @param cb - Callback function that receives either an error or system information
   * @example
   * sysinfoService.getSystemInfo((error, info) => {
   *   if (error) {
   *     console.error('Error:', error);
   *     return;
   *   }
   *   console.log('System Info:', info);
   * });
   *
   * @returns {void}
   *
   * The callback receives an object with the following properties:
   * - type: Operating system type (e.g., 'Windows_NT', 'Linux', 'Darwin')
   * - platform: Node.js platform identifier (e.g., 'win32', 'linux', 'darwin')
   * - arch: System architecture (e.g., 'x64', 'arm64')
   * - linux: Boolean indicating if system is Linux
   * - osx: Boolean indicating if system is macOS
   * - windows: Boolean indicating if system is Windows
   * - smartMachine: Boolean indicating if system is SunOS
   * - hostname: System hostname
   * - username: Current user's username
   * - homedir: User's home directory (normalized with forward slashes)
   * - tmpdir: System temporary directory (normalized with forward slashes)
   */
  getSystemInfo(cb: SysInfoCallbackFn): void {
    if (this.systemInfo) {
      return cb(null, this.systemInfo);
    }


    const ret = new Sysinfo();
    ret.type = os.type();
    ret.platform = platform;
    ret.arch = os.arch();
    ret.linux = platform.indexOf("linux") === 0;
    ret.osx = platform === "darwin";
    ret.windows = platform.indexOf("win") === 0;
    ret.smartMachine = platform === "sunos";
    ret.hostname = os.hostname();
    ret.username = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
    ret.homedir = os.homedir().replace(/\\/g, "/");
    ret.tmpdir = os.tmpdir().replace(/\\/g, "/");

    if (ret.username) {
      return cb(null, ret);
    }

    if (ret.osx || ret.linux) {
      exec("id -un", (err, stdout) => {
        ret.username = stdout.trim();
        this.systemInfo = ret;
        cb(err, ret);
      });
    } else if (ret.windows) {
      exec("whoami", {encoding: "utf8"}, (err, stdout) => {
        ret.username = stdout.trim().replace(/^.*\\/, ""); // xyz\user -> user

        this.systemInfo = ret;
        cb(err, ret);
      });
    } else {
      this.systemInfo = ret;
      cb(null, ret);
    }
  }

  /**
   * Provides system information using a Promise-based interface
   *
   * @returns {Promise<SysinfoIf>} A promise that resolves with the system information
   *
   * @example
   * try {
   *   const sysInfo = await sysinfoService.getSystemInfoPromise();
   *   console.log('System Info:', sysInfo);
   * } catch (error) {
   *   console.error('Error:', error);
   * }
   */
  getSystemInfoPromise(): Promise<SysinfoIf> {
    return new Promise<SysinfoIf>((resolve, reject) => {
      this.getSystemInfo((err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      });
    });
  }

  /**
   * Provides system information as an Observable stream
   *
   * @returns {Observable<SysinfoIf>} An Observable that emits system information
   *
   * @example
   * sysinfoService.getData().subscribe({
   *   next: (info) => console.log('System Info:', info),
   *   error: (error) => console.error('Error:', error)
   * });
   */
  getData(): Observable<SysinfoIf> {
    return from(this.getSystemInfoPromise());
  }

  /**
   * Determines the initial starting folder based on environment configuration
   * and system platform
   *
   * @returns {string} The path to the initial starting folder
   *
   * Priority order:
   * 1. FNF_START_PATH environment variable if set
   * 2. First path from FNF_CONTAINER_PATHS if set
   * 3. User's home directory on Windows
   * 4. Root directory ('/') on non-Windows systems
   *
   * Note: All returned paths use forward slashes regardless of platform
   */
  getFirstStartFolder(): string {
    const homeDir = os.homedir()?.replace(/\\/g, "/");
    const win = platform.indexOf("win") === 0;
    return FNF_START_PATH ? FNF_START_PATH :
      FNF_CONTAINER_PATHS ? FNF_CONTAINER_PATHS.split(',')[0] :
        win ? homeDir :
          '/';
  }
}
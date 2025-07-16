import {Injectable} from '@nestjs/common';
import * as os from 'os';

import {spawn} from 'child_process';
import {from, Observable, of} from 'rxjs';
import * as fse from 'fs-extra';
import * as fs from 'fs-extra';
import {Config, fixPath} from '@fnf/fnf-data';

export type DrivesCallbackFn = (eror: number, sysinfo: string[]) => void;

@Injectable()
export class DrivesService {

  static config: Config = new Config();
  readonly win = os.platform().indexOf("win") === 0;

  get config(): Config {
    return DrivesService.config;
  }

  getData(): Observable<string[]> {
    if (this.config.containerPaths?.length) {
      return of(this.config.containerPaths);
    }
    return from(this.getDrivesPromise());
  }

  getContainerRoot(): string | undefined {
    return this.config.dockerRoot;
  }

  hasContainerPaths(): boolean {
    return !!this.config.containerPaths?.length;
  }

  exists(path: string): boolean {
    if (this.config && this.config.dockerRoot &&
      (path.indexOf(this.config.dockerRoot) !== 0)) {
      return false;
    }
    try {
      return fse.existsSync(path);

    } catch (e) {
      try {
        // zip-Url?
        return fse.existsSync(path.split(':')[0]);
      } catch (e) {
        return false;
      }
    }
  }


  filterExists(files: string[]): string[] {
    return files.filter(f => {
      try {
        return fs.existsSync(f);
      } catch (e) {
        return false;
      }
    });
  }

  /**
   *
   * @param path  the path (if exists) , else the next possible path
   */
  checkAndFixPath(path: string): string {
    path = fixPath(path);

    while (path.length > 0) {
      if (this.win) {
        if (path.length === 2 && path[1] === ':') {
          path = path + '/'; //  'c:' ->  'c:/'
        }
      }
      if (this.exists(path)) {
        return path;

      }
      if (path.indexOf('/') > -1) {
        path = path.substr(0, path.lastIndexOf('/'));
      } else {
        return this.getRoot();
      }
    }
    return this.getRoot();
  }

  private getRoot(): string {
    if (this.config && this.config.dockerRoot) {
      return this.config.dockerRoot;
    }
    if (this.win) {
      return 'c:/';
    }
    return '/';
  }

  private getWinDrives(callback: DrivesCallbackFn) {
    if (!this.win) {
      return callback(null, []);
    } // for windows only.

    let stdout = '';
    const list = spawn('cmd');

    list.stdout.on('data', function (data) {
      stdout += data;
    });

    list.stderr.on('data', function (data) {
      console.error('stderr: ' + data);
    });

    list.on('exit', function (code) {
      if (code == 0) {
        let data = stdout.split('\r\n');
        data = data.splice(4, data.length - 7);
        data = data
          .map(Function.prototype.call, String.prototype.trim)
          .map(s => s + '/');
        callback(null, data);
      } else {
        callback(code, null);
      }
    });
    try {
      list.stdin.write('wmic logicaldisk get caption\n');
      list.stdin.end();
    } catch (e) {
      callback(null, []);
    }
  }

  private getDrivesPromise(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.getWinDrives((err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      });
    });
  }
}

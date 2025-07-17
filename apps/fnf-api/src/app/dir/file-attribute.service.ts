import {Injectable} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as child_process from 'child_process';
import {promisify} from 'util';
import {FileAttributeType} from "@fnf-data";


const exec = promisify(child_process.exec);

@Injectable()
export class FileAttributeService {


  async getFileAttribute(filePath: string): Promise<FileAttributeType> {
    const platform = os.platform();
    const stats = await fs.stat(filePath);
    const basename = path.basename(filePath);

    let hidden = false;
    let executable = false;
    let readonly = false;
    let system = false;

    if (platform === 'win32') {
      // Windows: use PowerShell to get attributes
      const {stdout} = await exec(`powershell -command "(Get-Item '${filePath}').Attributes"`);
      const attrs = stdout.toLowerCase();

      hidden = attrs.includes('hidden');
      system = attrs.includes('system');
      readonly = attrs.includes('readonly');
      executable = /\.(exe|bat|cmd|com|ps1)$/i.test(filePath); // crude executable check
    } else {
      // macOS / Linux
      hidden = basename.startsWith('.');
      system = false; // not supported natively
      readonly = !(stats.mode & 0o200); // owner write bit
      executable = !!(stats.mode & 0o111); // any execute bit
    }

    return {hidden, executable, readonly, system};
  }
}

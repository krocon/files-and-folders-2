import {Injectable} from '@nestjs/common';
import {Config, FindFolderPara} from '@fnf/fnf-data';
import * as fs from "fs-extra";


@Injectable()
export class FindFolderService {

  static config: Config = new Config();

  get config(): Config {
    return FindFolderService.config;
  }


  async findFolders(para: FindFolderPara): Promise<string[]> {
    const found: string[] = [];
    const dirs = [...para.startDirs];
    const visitedPaths = new Set<string>(); // Prevent cycles
    const currentDepth = new Map<string, number>();

    for (const dir of para.startDirs) {
      currentDepth.set(dir, 0);
    }

    while (dirs.length) {
      const dir = dirs.pop();
      if (!dir || visitedPaths.has(dir)) continue;

      visitedPaths.add(dir);
      const depth = currentDepth.get(dir) || 0;

      if (depth >= para.folderDeep) continue;

      try {
        if (fs.existsSync(dir)) {
          const items: string[] = await fs.readdir(dir);
          for (const item of items) {

            if (!item.startsWith('.')) {
              const fullPath = dir + '/' + item; // path.join(dir, item);
              try {
                const stats = await fs.stat(fullPath);
                if (stats.isDirectory()) {
                  if (!para.pattern || item.toLowerCase().includes(para.pattern)) {
                    found.push(fullPath);
                  }
                  dirs.push(fullPath);
                  currentDepth.set(fullPath, depth + 1);
                }
              } catch (statError) {
                console.warn(`Failed to stat ${fullPath}:`, statError);
              }
            }
          }
        }
      } catch (dirError) {
        console.warn(`Failed to read directory ${dir}:`, dirError);
      }
    }

    return found;
  }
}
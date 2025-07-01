import {Injectable} from '@nestjs/common';
import {Config, FindFolderPara} from '@fnf/fnf-data';
import * as fs from "fs-extra";
import * as os from "os";
import * as path from 'path';

// TODO siehe test.js

/**
 * Service responsible for finding folders in a file system based on specified search criteria.
 * Provides functionality to recursively search directories up to a specified depth,
 * with optional pattern matching for folder names.
 */
@Injectable()
export class FindFolderService {

  static config: Config = new Config();

  private homeDir = os.homedir();
  private ignoreDirs = new Set([
    '/System',
    '/private',
    '/dev',
    '/Network',
    '/cores',
    '/tmp',
    '/var',
    path.join(this.homeDir, 'Library'),
    path.join(this.homeDir, '.Trash'),
    path.join(this.homeDir, '.ssh'),
    path.join(this.homeDir, '.npm'),
    path.join(this.homeDir, '.cache'),
    path.join(this.homeDir, 'Applications'),
    // this.homeDir+'/Library',
    // this.homeDir+'/.Trash',
    // this.homeDir+'/.ssh',
    // this.homeDir+'/.npm',
    // this.homeDir+'/.cache',
    // this.homeDir+'/Applications'
  ]);

  private ignoreDirs2 = new Set([
    '/node_modules/',
    '/Library/',
    '.app/',
    '/.gallery/'
  ]);

  /**
   * Gets the current configuration settings for the FindFolder service.
   * @returns {Config} The current configuration instance.
   */
  get config(): Config {
    return FindFolderService.config;
  }


  /**
   * Recursively searches for folders in specified directories based on given parameters.
   *
   * @param para - Search parameters containing:
   *   - startDirs: Array of initial directories to start the search from
   *   - folderDeep: Maximum depth level for recursive search
   *   - pattern: Optional search pattern to filter folder names (case-insensitive)
   *
   * @returns Promise resolving to an array of full paths to matching folders
   *
   * @remarks
   * - Implements depth-first search with cycle detection
   * - Skips hidden folders (starting with '.')
   * - Handles file system errors gracefully with warning logs
   * - Respects maximum depth limit specified in parameters
   */
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
      if ([...this.ignoreDirs].some(ignorePath => dir.startsWith(ignorePath))) continue;
      if ([...this.ignoreDirs2].some(ignorePath => dir.includes(ignorePath))) continue;

      visitedPaths.add(dir);

      const depth = currentDepth.get(dir) || 0;
      if (depth >= para.folderDeep) continue;

      try {
        const entries = await fs.readdir(dir, {withFileTypes: true});
        for (const entry of entries) {
          const item = entry.name;

          if (!item.startsWith('.')) {
            const fullPath = path.join(dir, item);

            if (entry.isDirectory()) {
              if (!para.pattern || item.toLowerCase().includes(para.pattern)) {
                found.push(fullPath);
              }
              dirs.push(fullPath);
              currentDepth.set(fullPath, depth + 1);
            }
          }
        }
      } catch (dirError) {
        // console.warn(`Failed to read directory ${dir}:`, dirError);
      }
    }

    return found;
  }
}

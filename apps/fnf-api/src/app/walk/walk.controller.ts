import {Controller, Post} from "@nestjs/common";
import {MessageBody} from "@nestjs/websockets";
import {FileItem, FileItemIf, WalkData, WalkParaData} from "@fnf/fnf-data";
import * as fs from "fs-extra";
import * as path from "path";
import * as micromatch from "micromatch";


@Controller()
export class DirController {

  constructor() {
  }

  @Post("walkdirsync")
  async walkdirSync(@MessageBody() walkParaData: WalkParaData): Promise<WalkData> {
    const walkData = new WalkData(0, 0, 0, false);
    const files: FileItemIf[] = [];

    // Process initial files
    const initialFiles: FileItemIf[] = walkParaData.files
      .filter(f => fs.existsSync(f))
      .map(f => {
        const stats = fs.statSync(f);
        const parsedPath = path.parse(f);
        return new FileItem(
          parsedPath.dir,
          parsedPath.base,
          parsedPath.ext,
          '', // date
          stats?.size ?? 0,
          stats.isDirectory(),
          path.isAbsolute(f) // abs
        );
      });

    // Add initial files to the processing queue
    files.push(...initialFiles);

    // Initialize walkData with initial files
    walkData.fileCount = initialFiles.filter(f => !f.isDir).length;
    walkData.folderCount = initialFiles.filter(f => f.isDir).filter(f => this.matchesPattern(f, walkParaData.filePattern)).length;
    walkData.sizeSum = initialFiles.map(f => f.size ?? 0).reduce((a, b) => a + b, 0);

    // Process all files and directories
    while (files.length > 0) {
      const currentItem = files.pop();

      if (currentItem.isDir) {
        // Process directory
        if (this.matchesPattern(currentItem, walkParaData.filePattern)) {
          walkData.folderCount++;
        }

        try {
          const fullDirPath = path.join(currentItem.dir, currentItem.base);
          const entries = fs.readdirSync(fullDirPath, {withFileTypes: true});

          entries.forEach(entry => {
            const entryPath = path.join(fullDirPath, entry.name);
            const parsedPath = path.parse(entryPath);
            const isDir = entry.isDirectory();
            let size = 0;

            try {
              if (!isDir) {
                const stats = fs.lstatSync(entryPath);
                size = stats.size;
              }
            } catch (e) {
              console.warn('Error getting file stats: ' + entryPath);
            }

            files.push(new FileItem(
              parsedPath.dir,
              parsedPath.base,
              parsedPath.ext,
              '', // date
              size,
              isDir,
              path.isAbsolute(entryPath) // abs
            ));
          });
        } catch (e) {
          console.warn('Error reading directory: ' + path.join(currentItem.dir, currentItem.base));
        }
      } else {
        // Process file
        if (this.matchesPattern(currentItem, walkParaData.filePattern)) {
          walkData.fileCount++;
          walkData.sizeSum += currentItem.size;
        }
      }
    }

    // Mark as complete
    walkData.last = true;
    walkData.timestamp = Date.now();

    return walkData;
  }

  private matchesPattern(item: FileItemIf, pattern: string): boolean {
    if (!pattern) {
      return false;
    }
    return micromatch.isMatch(path.join(item.dir, item.base), pattern);
  }
}

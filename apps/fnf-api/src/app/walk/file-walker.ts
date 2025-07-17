import {FileItem, FileItemIf, WalkData, WalkParaData} from "@fnf-data";
import {Server} from "socket.io";
import * as fs from "fs-extra";
import * as path from "path";
import * as micromatch from "micromatch";


export class FileWalker {

  private readonly walkData: WalkData = new WalkData();
  private readonly files: FileItemIf[];
  private step = 0;
  private readonly STEPS_PER_MESSAGE: number;


  constructor(
    private readonly walkParaData: WalkParaData,
    private readonly cancellings: Record<string, boolean>,
    private readonly server: Server
  ) {

    const initialFiles: FileItemIf[] = walkParaData.files
      .filter(f => fs.existsSync(f))
      .map(f => {
        const stats = fs.statSync(f);
        return new FileItem(f, '', '', '', stats?.size ?? 0, stats.isDirectory());
      });

    this.files = [...initialFiles];
    this.STEPS_PER_MESSAGE = walkParaData.stepsPerMessage;

    this.walkData = new WalkData(
      initialFiles.filter(f => !f.isDir).length,
      initialFiles.filter(f => f.isDir).filter(this.matchesPattern.bind(this)).length,
      initialFiles.map(f => f.size ?? 0).reduce((a, b) => a + b, 0),
      false
    );
    this.emitWithDelay(this.walkParaData.emmitDataKey, this.walkData, () => this.processNextFile());
  }


  private matchesPattern(item: FileItemIf): boolean {
    if (!this.walkParaData.filePattern) {
      return false;
    }
    return (micromatch.isMatch(path.join(item.dir, item.base), this.walkParaData.filePattern));
  }

  private emitWithDelay(key: string, data: WalkData, callback: () => void): void {
    this.server.emit(key, data);
    setImmediate(callback);
  }

  private shouldEmitProgress(): boolean {
    return this.step % this.STEPS_PER_MESSAGE === 0;
  }

  private processDirectory(item: FileItemIf): void {
    if (this.matchesPattern(item)) {
      this.walkData.folderCount++;
    }

    if (this.shouldEmitProgress()) {
      this.emitWithDelay(this.walkParaData.emmitDataKey, this.walkData, () => this.processNextFile());
      return;
    }

    try {
      const entries = fs.readdirSync(item.dir, {withFileTypes: true});
      this.addNewFilesToProcess(entries, item.dir);
    } catch (e) {
      console.warn('Error reading directory: ' + item.dir);
    }
  }

  private processFile(item: FileItemIf): void {
    if (!this.matchesPattern(item)) return; // skip
    this.walkData.fileCount++;
    this.walkData.sizeSum += item.size;
    this.walkData.timestamp = Date.now();
  }

  private addNewFilesToProcess(entries: fs.Dirent[], parentDir: string): void {
    entries.forEach(entry => {
      const fullPath = path.join(parentDir, entry.name);
      const isDir = entry.isDirectory();
      const size = isDir ? 0 : fs.lstatSync(fullPath).size;

      this.files.push(new FileItem(
        fullPath,
        entry.name,
        '', // ext
        '', // date
        size ?? 0,
        isDir,
        false // abs
      ));
    });
  }

  private processNextFile(): void {
    if (this.isProcessingComplete()) {
      this.emitFinalUpdate();
      return;
    }

    if (this.cancellings[this.walkParaData.emmitCancelKey]) {
      return;
    }

    this.step++;
    const currentItem = this.files.pop();

    try {
      if (currentItem.isDir) {
        this.processDirectory(currentItem);
      } else {
        this.processFile(currentItem);
      }

      if (this.shouldEmitProgress()) {
        this.emitWithDelay(this.walkParaData.emmitDataKey, this.walkData, () => this.processNextFile());
      } else {
        this.processNextFile();
      }
    } catch (error) {
      console.error('Error processing file:', error);
      this.processNextFile();
    }
  }

  private isProcessingComplete(): boolean {
    return this.files.length === 0;
  }

  private emitFinalUpdate(): void {
    this.walkData.last = true;
    this.emitWithDelay(this.walkParaData.emmitDataKey, this.walkData, () => {
      // Final emit completed
    });
  }
}
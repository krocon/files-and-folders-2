import {FileItemIf, PanelIndex} from "@fnf/fnf-data";

import {GroupFilesData} from "./group-files.data";
import {GroupFilesOptions} from "./group-files-options";


export class GroupFilesDialogData {

  data = new GroupFilesData();
  options = new GroupFilesOptions();

  // targetDirs: string[] = [];

  constructor(
    public rows: FileItemIf[] = [],
    public sourceDir: string = '',
    public sourcePanelIndex: PanelIndex = 0,
    public targetDir: string = '',
    public targetPanelIndex: PanelIndex = 1,
  ) {
    // this.targetDirs = [];
    // if (targetDir && !targetDir.startsWith('tabfind')) {
    //   this.targetDirs.push(targetDir);
    // }
    // if (sourceDir && !sourceDir.startsWith('tabfind')) {
    //   this.targetDirs.push(sourceDir);
    // }
    // if (!this.targetDirs.length) {
    //   this.targetDirs.push('/');
    // }
  }
}

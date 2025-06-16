export class FindFolderPara {

  constructor(
    public startDirs: string[] = [],
    public pattern: string = '',
    public folderDeep: number = 5
  ) {
  }
}
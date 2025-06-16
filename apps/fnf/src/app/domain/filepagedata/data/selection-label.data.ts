export class SelectionLabelData {

  constructor(
    public selectedSizeSumText: string = "0",
    public sizeSumText: string = "0 MB",
    public selectedFileCount: number = 0,
    public fileCount: number = 0,
    public selectedFolderCount: number = 0,
    public folderCount: number = 0
  ) {
  }
}

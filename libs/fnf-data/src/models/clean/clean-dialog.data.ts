export class CleanDialogData {

  public folders: string[] | undefined;

  constructor(
    public folder: string = "",
    public pattern: string = "",
    public deleteEmptyFolders = true,
  ) {
  }
}

export class FindDialogData {

  public folders: string[] | undefined;

  constructor(
    public folder: string,
    public pattern: string,
    public newtab = true,
    public directoriesOnly: boolean = false
  ) {
  }
}

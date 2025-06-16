export class DirPara {

  private static RID = 1000;
  public rid: number;

  constructor(
    public path: string,
    public componentId: string = '',
    public nocache: boolean = true
  ) {
    this.rid = DirPara.RID++;
  }

  equals(other: DirPara): boolean {
    if (!other) return false;
    return this.path === other.path &&
      this.componentId === other.componentId &&
      this.nocache === other.nocache;
  }

}

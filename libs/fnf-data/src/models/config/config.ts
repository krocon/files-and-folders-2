export class Config {

  constructor(
    public incompatiblePaths: string[] = [],
    public containerPaths: string[] = [],
    public startPath = '',
    public dockerRoot = ''
  ) {
  }

}

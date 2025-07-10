export class WalkParaData {

  constructor(
    public files: string[] = [],
    public filePattern: string = "",
    public emmitDataKey = '',
    public emmitCancelKey = '',
    public stepsPerMessage = 500
  ) {
  }

}

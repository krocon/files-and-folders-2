export class WalkParaData {

  constructor(
    public files: string[] = [],
    public emmitDataKey = '',
    public emmitCancelKey = '',
    public stepsPerMessage = 10
  ) {
  }

}

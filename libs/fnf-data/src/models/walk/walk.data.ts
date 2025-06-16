import {WalkDataIf} from './walk.data.if';

export class WalkData implements WalkDataIf {

  constructor(
    public fileCount: number = 0,
    public folderCount: number = 0,
    public sizeSum: number = 0,
    public last = false
  ) {
  }

}

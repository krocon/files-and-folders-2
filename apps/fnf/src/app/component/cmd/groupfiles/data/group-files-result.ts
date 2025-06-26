import { GroupFilesRow } from './group-files-row';

export class GroupFilesResult {
  constructor(
    public groupCount: number = 0,
    public rows: GroupFilesRow[] = []
  ) {}
}

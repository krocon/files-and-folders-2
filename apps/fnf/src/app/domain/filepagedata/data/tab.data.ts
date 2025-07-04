import {FindData} from "@fnf/fnf-data";

export class TabData {

  public history: string[] = [];
  public findData: FindData | undefined;
  public filterActive: boolean = false;
  public hiddenFilesVisible: boolean = false;
  public filterText: string = '';
  public id: number = 0;

  public historyIndex: number = 0;


  //public focusRowCriterea: Partial<FileItemIf> | null = null;

  constructor(
    public path: string
  ) {
  }
}

import {Injectable} from "@angular/core";
import {GotoAnythingDialogData} from "./goto-anything-dialog.data";
import {GotoAnythingDialogComponent} from "./goto-anything-dialog.component";
import {takeWhile} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {GotoAnythingDialogConfig} from "./goto-anything-dialog.config";
import {GotoAnythingOptionData} from "./goto-anything-option.data";
import {firstValueFrom, Observable} from "rxjs";
import {FindFolderPara} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class GotoAnythingDialogService {

  private static readonly config = {
    findFoldersUrl: "/api/findfolders",
  };

  constructor(
    public readonly dialog: MatDialog,
    private readonly httpClient: HttpClient,
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(GotoAnythingDialogService.config, config);
  }

  public open(data: GotoAnythingDialogData, cb: (target: GotoAnythingOptionData | undefined) => void) {
    let alive = true;
    const config = new GotoAnythingDialogConfig(data);
    return this.dialog
      .open<GotoAnythingDialogComponent, GotoAnythingDialogData, GotoAnythingOptionData | undefined>(GotoAnythingDialogComponent, config)
      .afterClosed()
      .pipe(takeWhile(() => alive))
      .subscribe(item => {
        cb(item);
        alive = false;
      });
  }

  async fetchFolders(value: string, dirs: string[]): Promise<GotoAnythingOptionData[]> {
    const arr = value.split('/');
    const filterValue = arr[arr.length - 1];

    try {
      const response = await firstValueFrom(
        this.httpClient
          .post<string[]>(
            GotoAnythingDialogService.config.findFoldersUrl,
            new FindFolderPara(dirs, filterValue, 2)
          )
      );

      if (response) {
        return response.map(f => new GotoAnythingOptionData('cd', f));
      }

    } catch (error) {
      console.error('Error fetching folders:', error);
    }
    return [];
  }

  findFolders(para: FindFolderPara):Observable<string[]> {
    return this.httpClient.post<string[]>(GotoAnythingDialogService.config.findFoldersUrl, para);
  }

}

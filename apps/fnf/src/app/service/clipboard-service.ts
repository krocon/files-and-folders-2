import {Injectable} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {FileItemIf} from "@fnf/fnf-data";

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  public static spaceCountForTab = 2;

  constructor(
    private readonly clipboard: Clipboard
  ) {
  }


  copy(
    textToCopy: string,
    callback: Function = () => {
    }) {
    if (this.clipboard.copy(textToCopy)) {
      callback();
    }
  }

  public copyNames(arr: FileItemIf[]) {
    this.copy(this.getNamesText(arr));
  };

  public copyNamesAsJson(arr: FileItemIf[]) {
    this.copy(JSON.stringify(this.getNamesText(arr).split('\n'), null, ClipboardService.spaceCountForTab));
  };

  public copyFullNames(arr: FileItemIf[]) {
    this.copy(this.getFullNamesText(arr));
  };

  public copyFullNamesAsJson(arr: FileItemIf[]) {
    this.copy(JSON.stringify(this.getFullNamesText(arr).split('\n'), null, ClipboardService.spaceCountForTab));
  };


  private getNamesText(files: FileItemIf[]) {
    var buf = [];
    for (var i = 0; i < files.length; i++) {
      buf[buf.length] = files[i].base;
    }
    return buf.join('\n');
  }

  private getFullNamesText(files: FileItemIf[]) {
    var buf = [];
    for (var i = 0; i < files.length; i++) {
      buf[buf.length] = files[i].dir + '/' + files[i].base;
    }
    return buf.join('\n');
  }
}

import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {Subscription} from "rxjs";
import {DirEvent, FindData, FindDialogData} from "@fnf/fnf-data";

export type FindCallback = (event: DirEvent) => void;


@Injectable({
  providedIn: "root"
})
export class FindSocketService {

  private rid:string = 'abc';
  private cancellings: { [key: string]: Subscription } = {};
  private cache: { [key: string]: DirEvent } = {};


  constructor(
    private readonly socket: Socket
  ) {
  }

  public cancelFind(cancelKey: string) {
    this.socket.emit("cancelfind", cancelKey);
    const subscription = this.cancellings[cancelKey];
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  public createFindData(findDialogData: FindDialogData): FindData {
    this.rid = Math.random().toString(36).substring(2, 12);
    const listenKey = `find${this.rid}`;
    const cancelKey = `cancelfind${this.rid}`;
    const tabKey = `tabfind${this.rid}`;

    return new FindData(listenKey, cancelKey, tabKey, findDialogData);
  }

  public find(
    findData: FindData,
    callback: FindCallback
  ): void {
    if (this.cache[findData.emmitDataKey]) {
      callback(this.cache[findData.emmitDataKey]);
      return; // cache hit
    }
    this.cancellings[findData.emmitCancelKey] = this.socket
      .fromEvent<DirEvent, string>(findData.emmitDataKey)
      .subscribe(wd => {
        this.cache[findData.emmitDataKey] = wd;
        callback(wd);
      });
    this.socket.emit("find", findData);
  }


}

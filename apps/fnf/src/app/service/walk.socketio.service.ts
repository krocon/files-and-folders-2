import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {Subscription} from "rxjs";
import {WalkData, WalkParaData} from "@fnf/fnf-data";

export type WalkCallback = (walkData: WalkData) => void;


@Injectable({
  providedIn: "root"
})
export class WalkSocketService {

  private rid = 0;
  private cancellings: { [key: string]: Subscription } = {};

  constructor(
    private readonly socket: Socket
  ) {
  }

  public cancelWalkDir(cancelKey: string) {
    this.socket.emit("cancelwalk", cancelKey);
    const subscription = this.cancellings[cancelKey];
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  public walkDir(
    pathes: string[],
    callback: WalkCallback
  ): string {

    this.rid++;
    const listenKey = `walk${this.rid}`;
    const cancelKey = `cancelwalk${this.rid}`;
    const walkParaData = new WalkParaData(pathes, listenKey, cancelKey);

    this.cancellings[cancelKey] = this.socket
      .fromEvent<WalkData, string>(listenKey)
      .subscribe(wd => {
        callback(wd);
      });
    this.socket.emit("walkdir", walkParaData);

    return cancelKey;
  }

  public setupSocketConnection() {
    // nix
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}

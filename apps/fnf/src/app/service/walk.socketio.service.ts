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
  private isConnected = false;
  private pendingWalks: Array<{pathes: string[], callback: WalkCallback}> = [];

  constructor(
    private readonly socket: Socket
  ) {
    // Initialize connection status
    this.isConnected = this.socket.ioSocket?.connected || false;
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.processPendingWalks();
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.processPendingWalks();
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });
  }

  private processPendingWalks(): void {
    if (this.pendingWalks.length > 0) {
      console.log(`Processing ${this.pendingWalks.length} pending walks`);
      const walks = [...this.pendingWalks];
      this.pendingWalks = [];
      walks.forEach(walk => {
        this.walkDir(walk.pathes, walk.callback);
      });
    }
  }

  public cancelWalkDir(cancelKey: string) {
    // Extract the rid from the cancelKey (format: cancelwalk{rid})
    const ridStr = cancelKey.replace('cancelwalk', '');
    const rid = parseInt(ridStr, 10);

    // If socket is connected, send the cancel event
    if (this.isConnected) {
      this.socket.emit("cancelwalk", cancelKey);
    }

    // Remove from pending walks if it exists there
    // Since we don't store the listenKey in pendingWalks, we need to find a different way
    // to identify which pending walk to remove. For now, we'll just keep all pending walks
    // and let them be processed when the connection is restored.
    // In a more complete implementation, we might want to store additional metadata
    // with each pending walk to allow for proper cancellation.

    // Unsubscribe from the event
    const subscription = this.cancellings[cancelKey];
    if (subscription) {
      subscription.unsubscribe();
      delete this.cancellings[cancelKey];
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

    if (!this.isConnected) {
      console.log('Socket disconnected, queueing walk request');
      this.pendingWalks.push({pathes, callback});
    } else {
      this.socket.emit("walkdir", walkParaData);
    }

    return cancelKey;
  }


}

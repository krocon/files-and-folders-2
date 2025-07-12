import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {Subscription} from "rxjs";
import {WalkData, WalkParaData} from "@fnf/fnf-data";

export type WalkCallback = (walkData: WalkData) => void;


@Injectable({
  providedIn: "root"
})


export class WalkSocketService {

  static runningNumber = 0;

  private rid: number = Math.floor(Math.random() * 1000000) + 1;
  private cancellings: { [key: string]: Subscription } = {};
  private isConnected = false;
  private pendingWalks: Array<{ pathes: string[], filePattern: string, callback: WalkCallback }> = [];

  constructor(
    private readonly socket: Socket
  ) {
    // Initialize connection status
    this.isConnected = this.socket.ioSocket?.connected || false;
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.processPendingWalks();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
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
        this.walkDir(walk.pathes, walk.filePattern, walk.callback);
      });
    }
  }

  /**
   * Cancels an ongoing directory walk operation identified by the provided cancel key.
   *
   * This method handles the cancellation of directory walk operations by:
   * 1. Extracting the request ID (rid) from the cancel key
   * 2. Emitting a cancel event to the socket server if connected
   * 3. Cleaning up associated subscriptions
   *
   * The cancel key follows the format: `cancelwalk{rid}` where `rid` is a numeric identifier.
   *
   * @example
   * ```typescript
   * // Example 1: Basic usage in a component
   * export class MyComponent implements OnDestroy {
   *   private walkCancelKey: string;
   *
   *   constructor(private walkSocketService: WalkSocketService) {
   *     // Start a walk operation and store the cancel key
   *     this.walkCancelKey = this.walkSocketService.walkDir(['path/to/dir'], (data) => {
   *       console.log('Walk data:', data);
   *     });
   *   }
   *
   *   ngOnDestroy() {
   *     // Cancel the walk operation when component is destroyed
   *     this.walkSocketService.cancelWalkDir(this.walkCancelKey);
   *   }
   * }
   *
   * // Example 2: Usage in a dialog component
   * export class DialogComponent {
   *   constructor(private walkSocketService: WalkSocketService) {}
   *
   *   onCancelClick() {
   *     this.walkSocketService.cancelWalkDir(this.walkCancelKey);
   *     this.dialogRef.close();
   *   }
   * }
   * ```
   *
   * @param cancelKey - The unique identifier for the walk operation to cancel.
   *                   Must be in the format `cancelwalk{rid}` where rid is a number.
   *
   * @remarks
   * - If the socket is not connected when this method is called, the cancel event won't be sent to the server,
   *   but local cleanup will still occur.
   * - The method will clean up any associated subscription in the `cancellings` map.
   * - Current implementation maintains pending walks even after cancellation when offline,
   *   which may need to be revisited in future implementations.
   *
   * @see walkDir - The complementary method that initiates directory walks
   * @see WalkData - The data structure used for walk operation results
   */
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

  /**
   * Initiates a directory walk operation through a WebSocket connection to scan multiple directory paths.
   * This method allows for asynchronous directory traversal with progress updates through a callback function.
   *
   * @param {string[]} pathes - An array of directory paths to walk through
   * @param {string} filePattern - A glob pattern to filter files. If empty, all files will be counted
   * @param {WalkCallback} callback - A callback function that receives WalkData updates during the walk process
   * @returns {string} A unique cancel key that can be used to stop the walk operation
   *
   * @example
   * ```typescript
   * // Example 1: Basic directory walk with progress logging
   * const walkService = new WalkSocketService(socket);
   *
   * const paths = ['/home/user/documents', '/home/user/pictures'];
   * const cancelKey = walkService.walkDir(paths, '*.txt', (walkData: WalkData) => {
   *   console.log(`Files found: ${walkData.fileCount}`);
   *   console.log(`Folders found: ${walkData.folderCount}`);
   *   console.log(`Total size: ${walkData.sizeSum} bytes`);
   *
   *   if (walkData.last) {
   *     console.log('Walk operation completed');
   *   }
   * });
   *
   * // Example 2: Walk with cancellation
   * const cancelKey2 = walkService.walkDir(['path/to/dir'], '', (walkData: WalkData) => {
   *   if (walkData.fileCount > 1000) {
   *     // Too many files, cancel the operation
   *     walkService.cancelWalkDir(cancelKey2);
   *   }
   * });
   *
   * // Example 3: Progress tracking with percentage
   * let totalSize = 0;
   * const cancelKey3 = walkService.walkDir(['path/to/large/dir'], '*.jpg', (walkData: WalkData) => {
   *   totalSize += walkData.sizeSum;
   *
   *   if (walkData.last) {
   *     console.log(`Total scanned size: ${totalSize} bytes`);
   *   }
   * });
   *
   * @description
   * The walkDir method provides a way to recursively scan directories and receive progress updates.
   * Key features:
   * - Asynchronous operation through WebSocket connection
   * - Progress tracking via callback function
   * - Automatic queuing when socket is disconnected
   * - Cancellable operation
   * - Batched updates (default 500 items per message)
   *
   * The callback function receives WalkData objects containing:
   * - fileCount: Number of files found in the current batch
   * - folderCount: Number of folders found in the current batch
   * - sizeSum: Total size of files in the current batch (in bytes)
   * - last: Boolean indicating if this is the final update
   *
   * If the socket is disconnected when the method is called, the walk request
   * will be queued and executed when the connection is restored.
   *
   * @throws {Error} If the socket connection fails during the operation
   *
   * @see WalkData
   * @see WalkCallback
   * @see WalkParaData
   */
  public walkDir(
    pathes: string[],
    filePattern: string,
    callback: WalkCallback
  ): string {

    this.rid++;
    const listenKey = `walk${this.rid}`;
    const cancelKey = `cancelwalk${this.rid}`;
    const walkParaData = new WalkParaData(pathes, filePattern, listenKey, cancelKey);

    this.cancellings[cancelKey] = this.socket
      .fromEvent<WalkData, string>(listenKey)
      .subscribe(wd => {
        WalkSocketService.runningNumber++;
        wd.rn = WalkSocketService.runningNumber;

        callback(wd);
      });

    if (!this.isConnected) {
      this.pendingWalks.push({pathes, filePattern, callback});
    } else {
      this.socket.emit("walkdir", walkParaData);
    }

    return cancelKey;
  }


}

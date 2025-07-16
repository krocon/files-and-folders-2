import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {
  ActionGatewayKeys as keys,
  DirEventIf,
  DirPara,
  FilePara,
  fixPath,
  getZipUrlInfo,
  isZipUrl,
  SEARCH_SYMBOL
} from "@fnf/fnf-data";
import {map, mergeAll} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {fileItemSorter} from "../common/fn/file-item-sorter.fn";


@Injectable({
  providedIn: "root"
})
export class FileSystemService {

  private static readonly config = {
    checkPathUrl: "/api/checkpath",
    readDirUrl: "/api/readdir",
    filterExistsUrl: "/api/filterexists",
    defaultRoot: "/",
    fileWatcher: false
  };


  private readonly lastCalls: { [key: string]: DirPara } = {};

  private watcherObservable: Observable<DirEventIf[]>;
  private doneObservable: Observable<DirEventIf[]>;
  private readonly volumeObservable: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  constructor(
    private readonly socket: Socket,
    private readonly httpClient: HttpClient
  ) {

    this.socket
      .fromEvent<string[], string>("volumes")
      .subscribe(
        arr => this.volumeObservable.next(arr)
      );
    this.socket.emit("getvolumes");

    this.doneObservable = this.socket
      .fromEvent<DirEventIf[], string>(keys.ON_MULTI_DO_DONE);

    this.socket
      .fromEvent<FilePara, string>(keys.ON_MULTI_DO_ERROR)
      .subscribe(fp => {
        console.error("Error", fp);
      });

    this.watcherObservable = this.socket
      .fromEvent<DirEventIf, string>("watching") // disabled xxx
      .pipe(
        map(o => [o]),
      );
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(FileSystemService.config, config);
  }

  public getVolumes$(): Observable<string[]> {
    return this.volumeObservable;
  }

  /**
   * Fetches directory contents and establishes a watching mechanism for directory changes.
   *
   * This method performs several operations:
   * 1. Normalizes the input path
   * 2. Manages directory watching by unwatching previous calls for the same component
   * 3. Makes an HTTP POST request to fetch directory contents
   * 4. Filters results based on path or zip file contents
   * 5. Sets up directory watching for future changes
   *
   * @param {DirPara} para - Directory parameters object containing:
   *   - path: string - The directory path to fetch
   *   - componentId: string - Unique identifier for the requesting component
   *   - nocache: boolean - Whether to bypass cache
   *   - rid: number - Request identifier (auto-generated)
   *
   * @returns {Observable<DirEventIf[]>} An Observable that emits arrays of directory events:
   *   - Initial directory contents from HTTP request
   *   - Subsequent directory change events
   *   - Completion events
   *
   * @example
   * // Basic usage
   * const dirPara = new DirPara('/home/user/documents', 'myComponent');
   * this.fileSystemService.fetchDir(dirPara).subscribe({
   *   next: (events: DirEventIf[]) => {
   *     console.log('Directory contents:', events);
   *   },
   *   error: (error) => {
   *     console.error('Error fetching directory:', error);
   *   }
   * });
   *
   * @example
   * // Fetching contents of a zip file
   * const zipPara = new DirPara('/path/to/archive.zip/folder', 'zipViewer');
   * this.fileSystemService.fetchDir(zipPara).subscribe({
   *   next: (events: DirEventIf[]) => {
   *     console.log('Zip contents:', events);
   *   }
   * });
   *
   * @throws {Error} When the HTTP request fails
   *
   * @remarks
   * - The method automatically handles path normalization using fixPath()
   * - Previous watching operations for the same componentId are cleaned up
   * - For zip files, the results are filtered to show only contents within the specified zip path
   * - The method sets up directory watching after successful fetch
   *
   * @see {@link DirPara} for parameter object structure
   * @see {@link DirEventIf} for returned event structure
   */
  public fetchDir(para: DirPara): Observable<DirEventIf[]> {
    para.path = fixPath(para.path);

    if (this.lastCalls[para.componentId]) {
      this.unwatch(this.lastCalls[para.componentId]);
    }
    this.lastCalls[para.componentId] = para;


    const obsRead: Observable<DirEventIf[]> = this.httpClient.post<DirEventIf[]>(FileSystemService.config.readDirUrl, para);
    const obsDone: Observable<DirEventIf[]> = this.doneObservable;

    const obs: Observable<DirEventIf[]>[] = [obsRead, obsDone];
    if (FileSystemService.config.fileWatcher) {
      const obsWatcher: Observable<DirEventIf[]> = this.watcherObservable;
      obs.push(obsWatcher);
    }

    return of(...obs)
      .pipe(
        mergeAll()
      )
      .pipe(
        map<DirEventIf[], DirEventIf[]>((arr) => {
            arr = arr
              .filter(ev => {
                if (isZipUrl(para.path)) {
                  const zi = getZipUrlInfo(para.path);
                  return ev.dir.indexOf(zi.zipUrl) === 0;
                }
                return ev.dir.indexOf(para.path) === 0;
              });
            return arr;
          }
        ),
        map(dirEvents => {
          dirEvents.forEach(dirEvent => {
            dirEvent.items = dirEvent.items.sort((row1, row2) => {
              return fileItemSorter(row1, row2);
            });
          });
          return dirEvents;
        }),
        tap(o => this.watchDir(para))
      );
  }


  checkPath(path: string): Observable<string> {
    if (path === SEARCH_SYMBOL) {
      return of(path);
    }
    path = fixPath(path);
    const para = new DirPara(path);
    return this.httpClient
      .post(
        FileSystemService.config.checkPathUrl,
        para,
        {responseType: "text"}
      );
  }

  /**
   * Filters an array of file paths to return only those that exist in the file system.
   * This method makes a POST request to the server's filterExists endpoint to validate
   * the existence of multiple files in a single operation.
   *
   * @param files - An array of file paths to check for existence
   * @returns An Observable that emits an array of strings containing only the paths that exist
   *
   * @example
   * ```typescript
   * // Create an instance of FileSystemService
   * const fileSystemService = new FileSystemService(socket, httpClient);
   *
   * // Array of paths to check
   * const pathsToCheck = [
   *   '/path/to/file1.txt',
   *   '/path/to/file2.txt',
   *   '/path/to/non-existent.txt'
   * ];
   *
   * // Filter existing files
   * fileSystemService.filterExists(pathsToCheck).subscribe(
   *   existingFiles => {
   *     console.log('Existing files:', existingFiles);
   *     // Output might be: ['/path/to/file1.txt', '/path/to/file2.txt']
   *   },
   *   error => {
   *     console.error('Error checking files:', error);
   *   }
   * );
   * ```
   *
   * @remarks
   * - The method uses the HTTP POST method to send the array of paths to the server
   * - The server endpoint is defined in the configuration as `filterExistsUrl`
   * - The response will only include paths that actually exist in the file system
   * - This method is useful for validating multiple paths in a single request
   * - Non-existent paths are automatically filtered out from the response
   *
   * @throws Will throw an error if:
   * - The server request fails
   * - The paths are inaccessible due to permissions
   * - The server endpoint is not properly configured
   *
   * @see {@link ConfigService} for configuration settings
   * @see {@link HttpClient} for the underlying HTTP client implementation
   */
  filterExists(files: string[]): Observable<string[]> {
    return this.httpClient
      .post<string[]>(
        FileSystemService.config.filterExistsUrl,
        files);
  }

  private unwatch(para: DirPara) {
    if (FileSystemService.config.fileWatcher) {
      this.socket.emit("unwatch", para);
    }
  }

  private watchDir(para: DirPara) {
    if (FileSystemService.config.fileWatcher) {
      this.socket.emit("watch", para);
    }
  }


}
import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {Observable, of, tap} from "rxjs";
import {
  ActionGatewayKeys as keys,
  DirEvent,
  DirEventIf,
  DirPara,
  FileItemIf,
  FilePara,
  fixPath,
  getZipUrlInfo,
  isZipUrl,
  SEARCH_SYMBOL
} from "@fnf/fnf-data";
import {map, mergeAll} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class FileSystemService {

  private static readonly config = {
    checkPathUrl: "/api/checkpath",
    readDirUrl: "/api/readdir"
  };


  private readonly cache: { [key: string]: DirEventIf[] } = {};
  private readonly lastCalls: { [key: string]: DirPara } = {};

  // private watching = false;

  // private watcherObservable: Observable<DirEventIf[]>;
  private doneObservable: Observable<DirEventIf[]>;
  private errorObservable: Observable<FilePara>;


  constructor(
    private readonly socket: Socket,
    private readonly httpClient: HttpClient
  ) {
    // this.watcherObservable = this.socket
    //   .fromEvent<DirEventIf, string>("watchingxxx") // disabled xxx
    //   .pipe(
    //     map(o => [o]),
    //   );

    this.doneObservable = this.socket
      .fromEvent<DirEventIf[], string>(keys.ON_MULTI_DO_DONE);

    this.errorObservable = this.socket.fromEvent<FilePara, string>(keys.ON_MULTI_DO_ERROR);
    this.errorObservable.subscribe(fp => {
      console.error("Error", fp);
    });
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(FileSystemService.config, config);
  }


  public fetchDir(para: DirPara): Observable<DirEventIf[]> {
    para.path = fixPath(para.path);

    if (this.lastCalls[para.componentId]) {
      this.unwatch(this.lastCalls[para.componentId]);
    }
    this.lastCalls[para.componentId] = para;

    const obsRead: Observable<DirEventIf[]> = this.httpClient.post<DirEventIf[]>(FileSystemService.config.readDirUrl, para);
    // const obsWatcher: Observable<DirEventIf[]> = this.watcherObservable;
    const obsDone: Observable<DirEventIf[]> = this.doneObservable;

    return of(obsRead, /*obsWatcher,*/ obsDone)
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
        tap(o => this.watchDir(para))
      );
  }

  /*
    public loadDir(para: DirPara): Observable<DirEventIf[]> {
      para.path = fixPath(para.path);

      if (this.lastCalls[para.componentId]) {
        this.unwatch(this.lastCalls[para.componentId]);
      }
      this.lastCalls[para.componentId] = para;

      const obsRead: Observable<DirEventIf[]> = this.readDirAtOnce(para);
      const obsWatcher: Observable<DirEventIf[]> = this.watcherObservable;
      const obsDone: Observable<DirEventIf[]> = this.doneObservable;

      return of(obsRead, obsWatcher, obsDone)
        .pipe(
          mergeAll()
        )
        .pipe(
          map<DirEventIf[], DirEventIf[]>((arr) => arr.filter(ev => ev.dir.indexOf(para.path) === 0)
          )
        );
    }
    */

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

  private readDirAtOnce(para: DirPara): Observable<DirEventIf[]> {
    const dir = para.path;

    return new Observable<DirEventIf[]>(
      (subscriber) => {

        const rid = para.rid;
        let fileItems: FileItemIf[] = [];
        const subscription = this.readDirFileByFile(dir, rid)
          .subscribe(o => {
            if (o) {
              if (o.begin) {
                fileItems = [];
              }
              o.items?.forEach(f => fileItems.push(f));
              if (o.end) {
                const items = fileItems;
                const event = new DirEvent(dir, items, true, true, items.length, "", "list");
                const ret = [event];
                this.cache[dir] = ret;
                subscriber.next(ret);
                subscription.unsubscribe();
                this.watchDir(para);
              }
            }
          });
      }
    );
  }

  private unwatch(para: DirPara) {
    // this.socket.emit("unwatch", para);
  }

  private watchDir(para: DirPara) {
    // this.socket.emit("watch", para);
  }

  private readDirFileByFile(
    path: string,
    rid: number
  ): Observable<DirEventIf> {
    const listenOn = `dir${rid}`;
    const obs = this.socket.fromEvent<DirEventIf, string>(listenOn);

    const eventName = "dir";
    this.socket.emit(eventName, {path, rid, nocache: true});
    return obs;
  }

}

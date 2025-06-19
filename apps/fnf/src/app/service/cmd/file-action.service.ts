import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActionGatewayKeys as keys, DoEventIf, FilePara, OnDoResponseType} from "@fnf/fnf-data";
import {Observable} from "rxjs";
import {Socket} from "ngx-socket-io";


@Injectable({
  providedIn: "root"
})
export class FileActionService {

  private static readonly config = {
    url: "api/do",
    multiUrl: "api/do/multi"
  };

  constructor(
    private readonly httpClient: HttpClient,
    private readonly socket: Socket
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(FileActionService.config, config);
  }

  do(filePara: FilePara): Observable<OnDoResponseType> {
    const url = FileActionService.config.url;
    return this.httpClient.post<OnDoResponseType>(url, filePara);
  }

  multiDo(fileParas: FilePara[]): void {
    this.socket.emit(keys.MULTI_DO, fileParas);
  }


}

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ConvertPara, ConvertResponseType} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {QueueFileOperationParams} from "../../domain/cmd/queue-file-operation-params";


@Injectable({
  providedIn: "root"
})
export class AiCompletionService {

  private static readonly config = {
    convertnamesUrl: "/api/ai/convertnames",
    groupfilesUrl: "/api/ai/groupfiles",
    hasOpenAiApiKeyUrl: "/api/ai/hasopenaiapikey"
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(AiCompletionService.config, config);
  }


  hasOpenAiApiKey(): Observable<boolean> {
    return this.httpClient
      .post<boolean | string>(AiCompletionService.config.hasOpenAiApiKeyUrl, null)
      .pipe(
        map(r => r === 'true' || r === true)
      );
  }

  convertnames(para: ConvertPara): Observable<ConvertResponseType> {
    return this.httpClient
      .post<ConvertResponseType>(
        AiCompletionService.config.convertnamesUrl,
        para
      );
  }

  groupfiles(para: ConvertPara): Observable<ConvertResponseType> {
    return this.httpClient
      .post<ConvertResponseType>(
        AiCompletionService.config.groupfilesUrl,
        para
      );
  }

  fileOperationParams2Url(r: QueueFileOperationParams): string {
    return r.source.dir + '/' + r.source.base;
  }


}
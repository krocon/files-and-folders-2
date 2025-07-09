import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ConvertPara, ConvertResponseType} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: "root"
})
export class MultiRenameAiService {

  private static readonly config = {
    convertUrl: "/api/convertnames",
    hasOpenAiApiKeyUrl: "/api/hasopenaiapikey"
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(MultiRenameAiService.config, config);
  }


  hasOpenAiApiKey(): Observable<boolean> {
    return this.httpClient
      .post<boolean | string>(MultiRenameAiService.config.hasOpenAiApiKeyUrl, null)
      .pipe(
        map(r => r === 'true' || r === true)
      );
  }

  convert(para: ConvertPara): Observable<ConvertResponseType> {
    return this.httpClient
      .post<ConvertResponseType>(
        MultiRenameAiService.config.convertUrl,
        para
      );
  }


}
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ConvertPara, ConvertResponseType} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class MultiRenameAiService {

  private static readonly config = {
    convertUrl: "/api/convertnames"
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(MultiRenameAiService.config, config);
  }


  convert(para: ConvertPara): Observable<ConvertResponseType> {
    return this.httpClient
      .post<ConvertResponseType>(
        MultiRenameAiService.config.convertUrl,
        para
      );
  }


}
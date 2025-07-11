import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CleanDialogData, CleanResult} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class CleanService {


  private static readonly config = {
    cleanUrl: "/api/clean"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(CleanService.config, config);
  }


  clean(data: CleanDialogData): Observable<CleanResult> {
    return this.httpClient
      .post<CleanResult>(
        CleanService.config.cleanUrl,
        data
      );
  }
}
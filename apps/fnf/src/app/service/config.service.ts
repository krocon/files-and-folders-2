import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Config} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class ConfigService {

  private static readonly config = {
    getUrl: "/api/config"
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ConfigService.config, config);
  }


  public getConfig(): Observable<Config | undefined> {
    return this.httpClient.get<Config>(ConfigService.config.getUrl);
  }

}

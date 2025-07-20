import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class ServershellService {


  private static readonly config = {
    spawnUrl: "/api/spawn",
    cancelSpawnUrl: "/api/cancelspawn",
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ServershellService.config, config);
  }


}
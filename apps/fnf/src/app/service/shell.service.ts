import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ShellCmdIf, ShellCmdResultIf} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class ShellService {


  private static readonly config = {
    shellUrl: "/api/shell"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ShellService.config, config);
  }


  shell(data: ShellCmdIf[]): Observable<ShellCmdResultIf[]> {
    return this.httpClient
      .post<ShellCmdResultIf[]>(
        ShellService.config.shellUrl,
        data
      );
  }
}
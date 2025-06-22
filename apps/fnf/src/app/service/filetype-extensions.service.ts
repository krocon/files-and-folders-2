import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FiletypeExtensionsIf} from "@fnf/fnf-data";


@Injectable({
  providedIn: "root"
})
export class FiletypeExtensionsService {

  private static readonly config = {
    getFiletypesUrl: "assets/filetype/filetypes.json"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(FiletypeExtensionsService.config, config);
  }


  getFiletypes(): Observable<FiletypeExtensionsIf[]> {
    return (this.httpClient.get<FiletypeExtensionsIf[]>(FiletypeExtensionsService.config.getFiletypesUrl));
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";

interface GlobPatternResponse {
  valid: boolean;
  error?: string;
}

@Injectable({
  providedIn: "root"
})
export class GlobValidatorService {


  private static readonly config = {
    checkGlobUrl: "/api/checkglob"
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(GlobValidatorService.config, config);
  }

  /**
   * Validates a glob pattern by calling the API
   * @param pattern The glob pattern to validate
   * @returns An Observable that emits true if the pattern is valid, false otherwise
   */
  validateGlobPattern(pattern: string): Observable<boolean> {
    // If pattern is empty, consider it valid
    if (!pattern || pattern.trim() === '') {
      return of(true);
    }

    return this.httpClient.post<GlobPatternResponse>(
      GlobValidatorService.config.checkGlobUrl,
      {pattern}
    ).pipe(
      catchError(() => of({valid: false})),
      // Map the response to a boolean
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (source: Observable<any>) => new Observable<boolean>(observer => {
        source.subscribe({
          next: (response) => {
            observer.next(response.valid);
            observer.complete();
          },
          error: (err) => {
            console.error('Error validating glob pattern', err);
            observer.next(false);
            observer.complete();
          }
        });
      })
    );
  }
}
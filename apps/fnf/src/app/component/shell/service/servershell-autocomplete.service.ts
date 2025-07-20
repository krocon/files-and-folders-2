import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServershellAutocompleteService {


  private static readonly config = {
    autocompleteUrl: '/api/shell-autocomplete'
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ServershellAutocompleteService.config, config);
  }

  /**
   * Get autocomplete suggestions for shell commands
   * @param input The current input text
   * @returns Observable of string array with matching commands
   */
  getAutocompleteSuggestions(input: string): Observable<string[]> {
    console.log('url', ServershellAutocompleteService.config.autocompleteUrl);
    if (!input) {
      return of([]);
    }

    return this.httpClient
      .get<string[]>(
        `${ServershellAutocompleteService.config.autocompleteUrl}?input=${encodeURIComponent(input)}`
      )
      .pipe(
        catchError(() => {
          console.error('Error fetching autocomplete suggestions');
          return of([]);
        })
      );
  }
}
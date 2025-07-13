import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShellAutocompleteService {


  private static readonly config = {
    autocompleteUrl: '/api/shell-autocomplete'
  };

  constructor(private readonly httpClient: HttpClient) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ShellAutocompleteService.config, config);
  }

  /**
   * Get autocomplete suggestions for shell commands
   * @param input The current input text
   * @returns Observable of string array with matching commands
   */
  getAutocompleteSuggestions(input: string): Observable<string[]> {
    console.log('url', ShellAutocompleteService.config.autocompleteUrl);
    if (!input) {
      return of([]);
    }

    return this.httpClient
      .get<string[]>(
        `${ShellAutocompleteService.config.autocompleteUrl}?input=${encodeURIComponent(input)}`
      )
      .pipe(
        catchError(() => {
          console.error('Error fetching autocomplete suggestions');
          return of([]);
        })
      );
  }
}
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";
import {GlobValidatorService} from "../../service/glob-validator.service";


/**
 * Async validator that validates a glob pattern using the API.
 * @param globValidatorService The service to use for validation
 * @returns An async validator function
 */
export function globPatternAsyncValidator(globValidatorService: GlobValidatorService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    // Allow empty values
    if (!value || value.trim() === '') {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    // Call the API to validate the pattern
    return globValidatorService.validateGlobPattern(value).pipe(
      map(isValid => {
        if (isValid) {
          return null;
        }
        return {invalidGlobPattern: 'Invalid glob pattern'};
      })
    );
  };
}
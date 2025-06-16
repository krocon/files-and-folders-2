import {Subject} from "rxjs";

/*

Usage:

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeDirEventService extends TypedEventService<ChangeDirEvent>{ }

 */
export class TypedEventService<T> {

  private valueChanges$: Subject<T> = new Subject();

  public valueChanges(): Subject<T> {
    return this.valueChanges$;
  }

  public next(o: T): void {
    this.valueChanges$.next(o);
  }

}

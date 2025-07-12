import {BehaviorSubject} from "rxjs";
import {TypedDataOptions} from "./typed-data-options";
import {TypeDataDefaultOptions} from "./type-data-default-options";

export class TypedDataService<T> {

  readonly valueChanges$: BehaviorSubject<T>;
  private readonly options: TypedDataOptions<T> = new TypeDataDefaultOptions<T>();

  constructor(
    private readonly key: string,
    private readonly defaultValue: T,
    private readonly _options: Partial<TypedDataOptions<T>> = new TypeDataDefaultOptions<T>()
  ) {
    if (_options.parse) this.options.parse = _options.parse;
    if (_options.stringify) this.options.stringify = _options.stringify;
    if (_options.clone) this.options.clone = _options.clone;
    if (_options.equals) this.options.equals = _options.equals;

    this.valueChanges$ = new BehaviorSubject<T>(defaultValue);
    this.init();
  }

  init() {
    const item = localStorage.getItem(this.key);
    if (!item) {
      if (this.defaultValue !== null) {
        const value = this.options.stringify(this.defaultValue);
        this.set2localStorage(value);
      } else {
        localStorage.removeItem(this.key);
      }
    }

    this.next();
  }

  update(nvObj: T): void {
    if (this.options.stringify(nvObj) !== localStorage.getItem(this.key)) {
      if (nvObj === null) {
        localStorage.removeItem(this.key);
        this.next();
      } else {
        const nv = this.options.stringify(nvObj);
        this.set2localStorage(nv);
        this.next();
      }
    }
  }

  getValue(): T {
    if (this.key) {
      const item = localStorage.getItem(this.key);
      if (item) {
        const parse = this.options.parse(item);
        if (parse !== null && parse !== undefined) {
          return parse;
        }
      }
    }
    return this.defaultValue;
  }

  private set2localStorage(s: string | null) {
    if (s) {
      localStorage.setItem(this.key, s);
    } else {
      localStorage.removeItem(this.key);
    }
  }

  private next() {
    const value = this.getValue();
    if (value || value === 0 || value === false) {
      this.valueChanges$.next(this.options.clone(value));
    }
  }


}

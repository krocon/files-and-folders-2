import {TypedDataOptions} from "./typed-data-options";

export class TypeDataDefaultOptions<T> implements TypedDataOptions<T> {

  equals: (x: T, y: T) => boolean = (x: T, y: T) => JSON.stringify(x) === JSON.stringify(y);

  clone: (x: T) => T = (x: T) => x === null ? null : JSON.parse(JSON.stringify(x));

  parse: (s: string) => T | null = (s: string) => s === null ? null : JSON.parse(s) as T;

  stringify: (x: T) => string | null = (x: T) => x === null ? null : JSON.stringify(x);

}

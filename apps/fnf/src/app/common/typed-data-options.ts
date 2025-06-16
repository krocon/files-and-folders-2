export interface TypedDataOptions<T> {

  equals: (x: T, y: T) => boolean;
  clone: (x: T) => T;
  parse: (s: string) => T | null;
  stringify: (x: T) => string | null;

}

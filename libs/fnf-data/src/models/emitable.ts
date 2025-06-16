export interface Emitable<T> {

  _cancelled: Record<string, unknown> | null;

  emit(s: string, o: T): void;

}

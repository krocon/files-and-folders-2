export function fetchT<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  return fetch(input, init).then(res => res.text()).then(t => JSON.parse(t) as T);
}
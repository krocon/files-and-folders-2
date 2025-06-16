import {fixSlash} from "./fix-slash.fn";


export function fixPath(s: string): string {
  if (!s) return '';
  s = fixSlash(s);
  if (s.length===2 && s[1]===':') {
    s = s + '/'; // c: -> c:/
  }
  return s;
}

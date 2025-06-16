export function fixSlash(s: string): string {
  if (!s) return '';
  return s
    .replace(/\\/g, "/")
    .replace(/\/\//g, "/");
}

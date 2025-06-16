import { isRoot } from "./is-root";

export function isSameDir(d1: string, d2: string): boolean {
  if (d1 === d2) return true;
  if (isRoot(d1) && isRoot(d2)) return true;

  if (d1
      .replace(/^[/.\\]/g, "")
      .replace(/[/.\\]$/g, "")
      .replace(/[/.\\]$/g, "")
      .replace(/\\/g, "/")
      .replace(/\/\//g, "/")
      .replace(/\/$/g, "")
    ===
    d2
      .replace(/^[/.\\]/g, "")
      .replace(/[/.\\]$/g, "")
      .replace(/\\/g, "/")
      .replace(/\/\//g, "/")
      .replace(/\/$/g, "")
  ) return true;

  return false;
}

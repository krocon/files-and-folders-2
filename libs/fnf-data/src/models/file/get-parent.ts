import { isRoot } from "./is-root";

export function getParent(url: string): string {
  if (isRoot(url)) return "";
  const arr = url.split("/");
  arr.length = arr.length - 1;
  return arr.join("/");
}

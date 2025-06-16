export function isRoot(url: string): boolean {
  if (url === "") return true;
  if (url === ".") return true;
  if (url === "./") return true;
  if (url === "/.") return true;
  if (url === "/") return true;
  if ((url.length === 2 || url.length === 3) && url[1] === ":") return true;
  return false;
}

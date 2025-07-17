export function path2DirBase(path: string): { dir: string, base: string } {
  return {
    dir: path.substring(0, path.lastIndexOf('/')),
    base: path.substring(path.lastIndexOf('/') + 1)
  }
}
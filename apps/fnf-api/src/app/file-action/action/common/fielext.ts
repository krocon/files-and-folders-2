export function fileExt(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  const lastSlashIndex = fileName.lastIndexOf("/");
  return (lastDotIndex === -1 || lastDotIndex < lastSlashIndex) ? "" : fileName.substring(lastDotIndex);
}
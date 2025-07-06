export function getFileNameByFullPath(fileNameOrUrl: string) {
  if (fileNameOrUrl.includes('/')) {
    const parts = fileNameOrUrl.split('/');
    return parts[parts.length - 1];
  }
  return fileNameOrUrl;
}
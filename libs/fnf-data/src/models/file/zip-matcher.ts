export const EXP_ZIP_FILE_URL = /([^:]+.\w{3}):(.*)/;
export const EXP_ZIP_FILE_BASE = /^.*\.(zip|ZIP|rar|RAR)$/;

export function getZipUrlInfo(url: string): ZipUrlInfo {
  const matchArr = url.match(EXP_ZIP_FILE_URL);
  if (matchArr) {
    return new ZipUrlInfo(matchArr[0], matchArr[1], matchArr[2]);
  }
  return new ZipUrlInfo("", "", "");
}


export function isZipUrl(url: string): boolean {
  return !!url.match(EXP_ZIP_FILE_URL);
}


export function isZipBase(url: string): boolean {
  return !!url.match(EXP_ZIP_FILE_BASE);
}

export class ZipUrlInfo {
  constructor(
    public readonly fullUrl: string,
    public readonly zipUrl: string,
    public readonly zipInnerUrl: string
  ) {
  }
}

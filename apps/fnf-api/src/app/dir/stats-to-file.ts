import {Stats} from "fs";
import {FileItem} from "@fnf/fnf-data";

export function stats2FileItem(stats: Stats, fileItem: FileItem): FileItem {
  // see https://npmdoc.github.io/node-npmdoc-fs-extra/build/apidoc.html#apidoc.element.fs-extra.Stats
  if (stats) {
    fileItem.size = stats.isDirectory() ? null : stats.size;
    fileItem.date = new Date(stats.atime).toISOString();
    fileItem.isDir = stats.isDirectory();
  }
  return fileItem;
}

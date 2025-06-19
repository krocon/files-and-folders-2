import {FileItem, FileItemIf} from "@fnf/fnf-data";


export function path2FileItems(path: string): FileItemIf[] {
  let ret: FileItemIf[] = [];

  // Handle empty path
  if (!path) {
    return ret;
  }

  // Split the path by '/'
  const segments = path.split('/');

  // Check if path is absolute
  const isAbsolute = path.startsWith('/');

  // Remove empty segments (can occur at the beginning if path starts with '/')
  const filteredSegments = segments.filter(segment => segment.length > 0);

  // Build up the path as we go
  let currentPath = isAbsolute ? '/' : '';

  // Create a FileItem for each segment
  for (let i = 0; i < filteredSegments.length; i++) {
    const segment = filteredSegments[i];

    // Add segment to current path
    if (i > 0 || isAbsolute) {
      currentPath += (i > 0 ? '/' : '') + segment;
    } else {
      currentPath = segment;
    }

    // Create a FileItem for this segment
    const fileItem = new FileItem(
      currentPath,  // dir: the full path up to this segment
      segment,      // base: the segment name
      '',           // ext: empty for directories
      '',           // date: empty
      0,            // size: 0
      true,         // isDir: true since each segment is a directory
      isAbsolute    // abs: true if the path is absolute
    );

    ret.push(fileItem);
  }

  return ret;
}

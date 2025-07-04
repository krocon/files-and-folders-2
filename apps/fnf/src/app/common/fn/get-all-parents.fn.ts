

export function getAllParents(path:string):string[] {
  // If path is empty or just a slash, return an array with just the root
  if (!path || path === '/') {
    return ['/'];
  }

  // Remove trailing slash if present (except for root path)
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

  const result: string[] = [];
  let currentPath = normalizedPath;

  // Add the path itself and all its parents to the result array
  while (currentPath !== '') {
    // Only add paths that are not the root path
    if (currentPath !== '/') {
      result.unshift(currentPath);
    }

    // If we've reached the root, break the loop
    if (currentPath === '/') {
      break;
    }

    // Get the parent directory
    const lastSlashIndex = currentPath.lastIndexOf('/');

    // If no slash found or it's the first character (root path), set to root
    if (lastSlashIndex <= 0) {
      currentPath = '/';
    } else {
      currentPath = currentPath.substring(0, lastSlashIndex);
    }
  }

  return result;
}

/**
 * Splits a file path into directory and base name components.
 *
 * This function processes a path string and separates it into two components:
 * - `dir`: The directory portion of the path (everything before the last slash)
 * - `base`: The base name portion (everything after the last slash)
 *
 * The function handles various path formats including:
 * - Paths with multiple consecutive slashes (automatically normalized)
 * - Paths with or without file extensions
 * - Root-level files
 * - Paths with trailing slashes
 * - Paths with no slashes
 * - Empty paths
 * - Windows-style paths
 * - Paths with special characters
 *
 * @param path - The file path to split
 * @returns An object containing the directory and base name components
 *
 * @example
 * // Basic usage
 * path2DirBase('/path/to/file.txt');
 * // Returns: { dir: '/path/to', base: 'file.txt' }
 *
 * @example
 * // Handling double slashes
 * path2DirBase('/path//to///file.txt');
 * // Returns: { dir: '/path/to', base: 'file.txt' }
 *
 * @example
 * // Root-level file
 * path2DirBase('/file.txt');
 * // Returns: { dir: '', base: 'file.txt' }
 *
 * @example
 * // Path with trailing slash
 * path2DirBase('/path/to/directory/');
 * // Returns: { dir: '/path/to/directory', base: '' }
 */
export function path2DirBase(path: string): { dir: string, base: string } {
  path = fixPath(path);
  return {
    dir: path.substring(0, path.lastIndexOf('/')),
    base: path.substring(path.lastIndexOf('/') + 1)
  }
}

/**
 * Combines and normalizes directory and base name components into a proper path structure.
 *
 * This function takes separate directory and base name components, joins them with a slash,
 * normalizes the resulting path (removing redundant slashes), and then splits it back
 * into proper directory and base name components.
 *
 * The function is useful when you have potentially malformed directory and base name components
 * that need to be normalized into a proper path structure.
 *
 * @param dir - The directory portion of the path
 * @param base - The base name portion of the path (may include subdirectories)
 * @returns An object containing the normalized directory and base name components
 *
 * @example
 * // Basic usage
 * dirBase2DirBase('/path/to', 'file.txt');
 * // Returns: { dir: '/path/to', base: 'file.txt' }
 *
 * @example
 * // Handling double slashes
 * dirBase2DirBase('/path//to', 'file.txt');
 * // Returns: { dir: '/path/to', base: 'file.txt' }
 *
 * @example
 * // When base contains subdirectories
 * dirBase2DirBase('/path/to', 'subdir/file.txt');
 * // Returns: { dir: '/path/to/subdir', base: 'file.txt' }
 *
 * @example
 * // With empty directory
 * dirBase2DirBase('', 'file.txt');
 * // Returns: { dir: '', base: 'file.txt' }
 */
export function dirBase2DirBase(dir: string, base: string): { dir: string, base: string } {
  const path = fixPath(dir + '/' + base);
  return {
    dir: path.substring(0, path.lastIndexOf('/')),
    base: path.substring(path.lastIndexOf('/') + 1)
  }
}

/**
 * Normalizes a directory and base name object by fixing any path-related issues.
 *
 * This function takes an object with `dir` and `base` properties, normalizes the path structure
 * using the `dirBase2DirBase` function, and modifies the original object with the normalized values.
 * The function returns the modified object for method chaining.
 *
 * This is particularly useful when you want to ensure that a directory/base name object is
 * properly normalized before further processing.
 *
 * @param o - An object containing directory and base name properties
 * @returns The normalized directory and base name object (same reference as input)
 *
 * @example
 * // Basic normalization
 * const obj = { dir: '/path//to', base: 'file.txt' };
 * fixBase2DirBase(obj);
 * // obj is now { dir: '/path/to', base: 'file.txt' }
 *
 * @example
 * // When base contains subdirectories
 * const obj = { dir: '/path/to', base: 'subdir/file.txt' };
 * fixBase2DirBase(obj);
 * // obj is now { dir: '/path/to/subdir', base: 'file.txt' }
 *
 * @example
 * // Method chaining
 * const result = fixBase2DirBase({ dir: '/path//to', base: 'file.txt' });
 * // result is { dir: '/path/to', base: 'file.txt' }
 */
export function fixBase2DirBase(o: { dir: string, base: string }): { dir: string, base: string } {
  const db = dirBase2DirBase(o.dir, o.base);
  o.dir = db.dir;
  o.base = db.base;
  return o;
}

/**
 * Normalizes a file path by replacing multiple consecutive slashes with a single slash.
 *
 * This utility function ensures that file paths are properly formatted by removing redundant
 * slashes. It's commonly used by other path manipulation functions to ensure consistent
 * path formatting.
 *
 * @param dir - The path string to normalize
 * @returns The normalized path string with all consecutive slashes reduced to single slashes
 *
 * @example
 * // Basic normalization
 * fixPath('/path//to///file.txt');
 * // Returns: '/path/to/file.txt'
 *
 * @example
 * // Path with no double slashes remains unchanged
 * fixPath('/path/to/file.txt');
 * // Returns: '/path/to/file.txt'
 *
 * @example
 * // Handling paths with only slashes
 * fixPath('////');
 * // Returns: '/'
 */
export function fixPath(dir: string): string {
  return dir.replace(/\/{2,}/g, '/');
}
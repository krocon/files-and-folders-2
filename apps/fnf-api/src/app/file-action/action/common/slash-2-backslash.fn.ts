/**
 * Converts forward slashes (/) to backslashes (\) in a given string.
 * This function is commonly used for converting Unix-style paths to Windows-style paths.
 *
 * @param s - The input string containing forward slashes to be converted
 * @returns A new string with all forward slashes replaced by backslashes
 *
 * @example
 * // Convert Unix path to Windows path
 * slash2backSlash('path/to/file') // returns 'path\to\file'
 *
 * @example
 * // Multiple slashes are all converted
 * slash2backSlash('//server/share/path') // returns '\\server\share\path'
 */
export function slash2backSlash(s: string): string {
  return s.replace(/\//g, "\\");
}

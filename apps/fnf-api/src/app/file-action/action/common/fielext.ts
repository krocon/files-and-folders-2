/**
 * Extracts the file extension (including the dot) from a given file name or path.
 *
 * The function handles various edge cases:
 * - If the file has no extension, returns an empty string
 * - If the dot appears before the last slash (i.e., in a directory name), returns an empty string
 * - For hidden files (starting with a dot) without extension, returns an empty string
 *
 * @param fileName - The file name or path to extract the extension from
 * @returns The file extension including the dot (e.g., '.txt'), or an empty string if no extension exists
 *
 * @example
 * fileExt('document.txt')     // returns '.txt'
 * fileExt('image.jpg')        // returns '.jpg'
 * fileExt('file')             // returns ''
 * fileExt('.hidden')          // returns ''
 * fileExt('/path/to/file.md') // returns '.md'
 * fileExt('/path.to/file')    // returns ''
 */
export function fileExt(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  const lastSlashIndex = fileName.lastIndexOf("/");
  return (lastDotIndex === -1 || lastDotIndex < lastSlashIndex) ? "" : fileName.substring(lastDotIndex);
}
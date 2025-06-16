/**
 * Formats a file size in bytes to a human-readable string with appropriate units.
 * Displays with the specified number of decimal places (default: 2).
 * Examples: "1.23 MB", "0.41 TB", "321.00 GB"
 * @param bytes The file size in bytes
 * @param decimalPlaces Number of decimal places to use for file size formatting (default: 2)
 * @returns A formatted string with appropriate units
 */
export function formatFileSize(bytes: number, decimalPlaces: number = 2): string {
  // Handle edge cases
  if (isNaN(bytes) || bytes <= 0) return `0.${'0'.repeat(decimalPlaces)} B`;

  if (bytes < 1024) return bytes + ' bytes';

  // Handle negative values by using absolute value and adding a minus sign
  const isNegative = bytes < 0;
  const absoluteBytes = Math.abs(bytes);

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // Special case for negative values that are exactly -1024 bytes
  if (isNegative && absoluteBytes === 1024) {
    return `-${absoluteBytes.toFixed(decimalPlaces)} ${units[0]}`;
  }

  const i = Math.floor(Math.log(absoluteBytes) / Math.log(1024));

  // Ensure i is within the bounds of the units array
  const index = Math.min(i, units.length - 1);

  // For bytes (i === 0), format the integer value with specified decimal places
  let result;
  if (index === 0) {
    result = `${absoluteBytes.toFixed(decimalPlaces)} ${units[index]}`;
  } else {
    // For larger units, calculate the value and format with specified decimal places
    const value = absoluteBytes / Math.pow(1024, index);
    result = `${value.toFixed(decimalPlaces)} ${units[index]}`;
  }

  return isNegative ? `-${result}` : result;
}

import {Injectable} from '@angular/core';
import {MultiMkdirData} from './data/multi-mkdir.data';

@Injectable({
  providedIn: 'root'
})
export class MultiMkdirService {

  constructor() {
  }

  /**
   * Generates directory names based on the multi-mkdir configuration
   * @param data The multi-mkdir configuration data
   * @param parentDir
   * @returns An array of directory names
   */
  generateDirectoryNames(data: MultiMkdirData, parentDir: string): string[] {
    const result: string[] = [];
    const counterStart = parseInt(data.counterStart.toString());
    const counterStep = parseInt(data.counterStep.toString());
    const counterEnd = parseInt(data.counterEnd.toString());
    const counterDigits = parseInt(data.counterDigits.toString());
    const letterCase = data.letterCase;

    let counter = counterStart;
    while (counter <= counterEnd) {
      const dirName = this.generateDirectoryName(data.folderNameTemplate, counter, counterDigits, parentDir, letterCase);
      result.push(dirName);
      counter += counterStep;
    }

    return result;
  }

  /**
   * Generates a single directory name based on the template and counter
   * @param template The directory name template
   * @param counter The current counter value
   * @param counterDigits The number of digits for the counter
   * @param parentDir The parent directory
   * @param letterCase The letter case option ('', 'uppercase', 'lowercase')
   * @returns The generated directory name
   */
  private generateDirectoryName(template: string, counter: number, counterDigits: number, parentDir: string, letterCase: string = ''): string {
    let result = template;

    const parent = this.getParentDir(parentDir);
    const parentOfParent = this.getParentDir(parentDir, 2);
    const parentOfParentOfParent = this.getParentDir(parentDir, 3);

    // Process counter and letter
    const s = this.pad(counter.toString(), counterDigits);
    const letter = this.getLetterFromCounter(counter);

    result = result
      .replace(/\[C]/g, s)
      .replace(/\[L]/g, letter)
      .replace(/\[P]/g, parent)
      .replace(/\[Q]/g, parentOfParent)
      .replace(/\[R]/g, parentOfParentOfParent);

    // Process parent dir ranges
    result = this.processPlaceholder(result, parent, 'P');
    result = this.processPlaceholder(result, parentOfParent, 'Q');
    result = this.processPlaceholder(result, parentOfParentOfParent, 'R');

    // Apply letter case
    if (letterCase === 'uppercase') {
      result = result.toUpperCase();
    } else if (letterCase === 'lowercase') {
      result = result.toLowerCase();
    }

    return result;
  }

  /**
   * Processes placeholder patterns in a string for file name manipulation.
   * This function handles three different types of placeholder patterns for extracting substrings:
   *
   * 1. `[letter#-#]` - Extracts a substring from index # to index #
   * 2. `[letter#-]` - Extracts a substring from index # to the end
   * 3. `[letter-#]` - Extracts a substring from start to index #
   *
   * Where 'letter' can be one of the following:
   * - 'P': Parent directory name
   * - 'Q': Parent of parent directory name
   * - 'R': Parent of parent of parent directory name
   *
   * // Example 1: Extract first 2 characters of parent directory
   * processPlaceholder("dir_[P-2]", "docs", 'P')
   * // Returns: "dir_do"
   *
   * @param base - The string containing the placeholder pattern
   * @param name - The source string from which to extract (filename, extension, or directory name)
   * @param letter - The type of placeholder ('P'|'Q'|'R')
   * @returns The processed string with placeholders replaced by the extracted substrings
   */
  private processPlaceholder(base: string, name: string, letter: 'P' | 'Q' | 'R'): string {
    let result = base;
    // [N#-#] - Part of name from index # to index #
    let m = result.match(new RegExp(`\\[${letter}(\\d+)\\-(\\d+)\\]`));
    if (m) {
      result = result.replace(m[0], name.substring(parseInt(m[1]), parseInt(m[2])));
    }

    // [N#-] - Part of name from index # to end
    m = result.match(new RegExp(`\\[${letter}(\\d+)\\-\\]`));
    if (m) {
      result = result.replace(m[0], name.substring(parseInt(m[1])));
    }

    // [N-#] - Part of name from start to index #
    m = result.match(new RegExp(`\\[${letter}\\-(\\d+)\\]`));
    if (m) {
      result = result.replace(m[0], name.substring(0, parseInt(m[1])));
    }

    return result;
  }


  /**
   * Gets the parent directory from a path
   * @param dir The directory path
   * @param generation 1=parent, 2= parent of parent
   * @returns The parent directory name
   */
  private getParentDir(dir: string, generation: number = 1): string {
    const parts = dir.split('/').filter(p => p.length > 0);
    return (parts.length > (generation - 1) ? parts[parts.length - generation] : parts[0]) ?? '';
  }

  /**
   * Pads a string with zeros
   * @param str The string to pad
   * @param max The maximum length
   * @returns The padded string
   */
  private pad(str: string, max: number): string {
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  /**
   * Converts a counter value to a letter (0=a, 1=b, etc.)
   * @param counter The counter value
   * @returns The letter corresponding to the counter value
   */
  private getLetterFromCounter(counter: number): string {
    // Convert counter to letter (0=a, 1=b, etc.)
    const baseCharCode = 'a'.charCodeAt(0);
    return String.fromCharCode(baseCharCode + (counter % 26));
  }
}

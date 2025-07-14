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
   * @returns An array of directory names
   */
  generateDirectoryNames(data: MultiMkdirData): string[] {
    const result: string[] = [];
    const counterStart = parseInt(data.counterStart.toString());
    const counterStep = parseInt(data.counterStep.toString());
    const counterEnd = parseInt(data.counterEnd.toString());
    const counterDigits = parseInt(data.counterDigits.toString());

    let counter = counterStart;
    while (counter <= counterEnd) {
      const dirName = this.generateDirectoryName(data.folderNameTemplate, counter, counterDigits);
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
   * @returns The generated directory name
   */
  private generateDirectoryName(template: string, counter: number, counterDigits: number): string {
    let result = template;

    // Process counter
    if (result.indexOf('[C]') > -1) {
      const s = this.pad(counter.toString(), counterDigits);
      result = result.replace(/\[C]/g, s);
    }

    // Process parent dir placeholders
    // These will be replaced with actual values when creating directories
    // For now, we just keep the placeholders

    return result;
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
}
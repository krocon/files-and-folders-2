import {Injectable} from '@angular/core';
import {QueueFileOperationParams} from '../../../domain/cmd/queue-file-operation-params';
import {MultiRenameData} from './data/multi-rename.data';
import {FileItemIf, PanelIndex} from "@fnf/fnf-data";
import {QueueActionEvent} from '../../../domain/cmd/queue-action-event';
import {CommandService} from '../../../service/cmd/command.service';
import {ReplacementItem} from './data/replacement.item';

@Injectable({
  providedIn: 'root'
})
export class MultiRenameService {

  constructor(
    private readonly commandService: CommandService
  ) {
  }

  /**
   * Updates the target property of each row based on the multi-rename configuration
   * @param rows The file operation parameters to update
   * @param data The multi-rename configuration data
   */
  updateTargets(rows: QueueFileOperationParams[], data: MultiRenameData): void {
    rows.forEach((row, index) => {
      if (row.source) {
        row.target = this.rename(row.source, data, index);
      }
    });
  }

  /**
   * Creates action events for multi-rename operations
   * @param rows The file operation parameters
   * @param panelIndex The panel index
   * @returns An array of action events
   */
  createActionEvents(rows: QueueFileOperationParams[], panelIndex: PanelIndex): QueueActionEvent[] {
    const actions: QueueActionEvent[] = [];

    for (const row of rows) {
      if (row.source && row.target && this.isFileChanged(row.source, row.target)) {
        actions.push(
          this.commandService.rename({
            bulk: true, // rows.length > CommandService.BULK_LOWER_LIMIT,
            source: row.source,
            srcPanelIndex: panelIndex,
            targetPanelIndex: panelIndex,
            target: row.target
          })
        );
      }
    }

    if (actions.length > 0) {
      actions.push(this.commandService.refreshPanel(panelIndex));
    }

    return actions;
  }

  /**
   * Renames a file according to the multi-rename configuration
   * @param source The file to rename
   * @param data The multi-rename configuration
   * @param index The index of the file in the list
   * @returns The renamed file
   */
  private rename(source: FileItemIf, data: MultiRenameData, index: number): FileItemIf {
    const target = {...source};
    const pattern = data.name;
    const ignoreExtension = data.ignoreExtension;

    const ext = source.base.split('.').pop() || '';
    const name = (source.base.substring(0, source.base.lastIndexOf(ext) - 1));

    const parent = this.getParentDir(source.dir);
    const parentOfParent = this.getParentDir(source.dir, 2);
    const parentOfParentOfParent = this.getParentDir(source.dir, 3);

    // console.info('source', source);
    // console.info('target', target);
    // console.info('pattern', pattern);
    // console.info('name', name);
    // console.info('ext', ext);
    // console.info('parent', parent);
    // console.info('parentOfParent', parentOfParent);
    // console.info('index', index);
    // console.info('data', data);
    // console.info('data.counterStart', data.counterStart);

    let processedName = this.applyCapitalization(name, data.capitalizeMode);

    if (data.replaceGermanUmlauts) {
      processedName = this.replaceUmlauts(processedName);
    }

    if (data.replaceRiskyChars) {
      processedName = processedName.replace(/[^a-zA-Z0-9_ \[\]\(\)\-\.]/g, '');
    }

    if (data.replaceSpaceToUnderscore) {
      processedName = processedName.replace(/ /g, '_');
    }

    if (data.replaceParentDir) {
      processedName = processedName.replace(parent, '');
    }

    let base = pattern
      .replace(/\[N\]/g, processedName)
      .replace(/\[E\]/g, ext)
      .replace(/\[P\]/g, parent)
      .replace(/\[Q\]/g, parentOfParent)
      .replace(/\[R\]/g, parentOfParentOfParent);

    // Process name ranges
    base = this.processNameRanges(base, name);

    // Process extension ranges
    base = this.processExtensionRanges(base, ext);

    // Process parent dir ranges
    base = this.processParentRanges(base, parent);

    // Process counter
    if (base.indexOf('[C]') > -1) {
      const counterStart = parseInt(data.counterStart.toString());
      const counterStep = parseInt(data.counterStep.toString());
      const counterDigits = parseInt(data.counterDigits.toString());
      const n = counterStart + (index * counterStep);
      const s = this.pad(n.toString(), counterDigits);

      base = base.replace(/\[C\]/g, s);
    }

    // Process replacements
    if (data.replacementsChecked) {
      for (const replacement of data.replacements) {
        base = this.replace(base, ext, replacement);
      }
    }

    target.dir = source.dir;
    target.base = base;
    target.ext = base.includes('.') ? '.' + base.split('.').pop() : '';
    return target;
  }

  /**
   * Checks if a file has been changed
   * @param source The source file
   * @param target The target file
   * @returns True if the file has been changed
   */
  private isFileChanged(source: FileItemIf, target: FileItemIf): boolean {
    return source.base !== target.base;
  }

  /**
   * Gets the parent directory from a path
   * @param dir The directory path
   * @param generation 1=parent, 2= parent of parent
   * @returns The parent directory name
   */
  private getParentDir(dir: string, generation: number = 1): string {
    const parts = dir.split('/').filter(p => p.length > 0);
    return parts.length > (generation - 1) ? parts[parts.length - generation] : parts[0];
  }

  /**
   * Applies capitalization to a string
   * @param name The string to capitalize
   * @param mode The capitalization mode
   * @returns The capitalized string
   */
  private applyCapitalization(name: string, mode: string): string {
    if (mode === 'chicago_manual_of_style') {
      return this.titleCaps(name);
    } else if (mode === 'lowercase') {
      return name.toLowerCase();
    } else if (mode === 'uppercase') {
      return name.toUpperCase();
    } else if (mode === 'capitalize_first_letter') {
      return name.charAt(0).toUpperCase() + name.slice(1);
    } else if (mode === 'capitalize_words') {
      return this.capitalize(name);
    }
    return name;
  }

  /**
   * Processes name ranges in the pattern
   * @param base The base pattern
   * @param name The name to process
   * @returns The processed pattern
   */
  private processNameRanges(base: string, name: string): string {
    let result = base;
// TODO N as parameter. can also be: P Q R E
    // [N#-#] - Part of name from index # to index #
    let m = result.match(/\[N(\d+)\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], name.substring(parseInt(m[1]), parseInt(m[2])));
    }

    // [N#-] - Part of name from index # to end
    m = result.match(/\[N(\d+)\-\]/);
    if (m) {
      result = result.replace(m[0], name.substring(parseInt(m[1])));
    }

    // [N-#] - Part of name from start to index #
    m = result.match(/\[N\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], name.substring(0, parseInt(m[1])));
    }

    return result;
  }

  /**
   * Processes extension ranges in the pattern
   * @param base The base pattern
   * @param ext The extension to process
   * @returns The processed pattern
   */
  private processExtensionRanges(base: string, ext: string): string {
    let result = base;

    // [E#-#] - Part of extension from index # to index #
    let m = result.match(/\[E(\d+)\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], ext.substring(parseInt(m[1]), parseInt(m[2])));
    }

    // [E#-] - Part of extension from index # to end
    m = result.match(/\[E(\d+)\-\]/);
    if (m) {
      result = result.replace(m[0], ext.substring(parseInt(m[1])));
    }

    // [E-#] - Part of extension from start to index #
    m = result.match(/\[E\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], ext.substring(0, parseInt(m[1])));
    }

    return result;
  }

  /**
   * Processes parent directory ranges in the pattern
   * @param base The base pattern
   * @param parent The parent directory to process
   * @returns The processed pattern
   */
  private processParentRanges(base: string, parent: string): string {
    let result = base;

    // [P#-#] - Part of parent from index # to index #
    let m = result.match(/\[P(\d+)\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], parent.substring(parseInt(m[1]), parseInt(m[2])));
    }

    // [P#-] - Part of parent from index # to end
    m = result.match(/\[P(\d+)\-\]/);
    if (m) {
      result = result.replace(m[0], parent.substring(parseInt(m[1])));
    }

    // [P-#] - Part of parent from start to index #
    m = result.match(/\[P\-(\d+)\]/);
    if (m) {
      result = result.replace(m[0], parent.substring(0, parseInt(m[1])));
    }

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

  /**
   * Replaces German umlauts with their ASCII equivalents
   * @param str The string to process
   * @returns The processed string
   */
  private replaceUmlauts(str: string): string {
    return str
      .replace(/[ÂÀÅÃ]/g, "A")
      .replace(/[âàåã]/g, "a")
      .replace(/Ä/g, "AE")
      .replace(/ä/g, "ae")
      .replace(/Ç/g, "C")
      .replace(/ç/g, "c")
      .replace(/[ÉÊÈË]/g, "E")
      .replace(/[éêèë]/g, "e")
      .replace(/[ÓÔÒÕØ]/g, "O")
      .replace(/[óôòõ]/g, "o")
      .replace(/Ö/g, "OE")
      .replace(/ö/g, "oe")
      .replace(/Š/g, "S")
      .replace(/š/g, "s")
      .replace(/ß/g, "ss")
      .replace(/[ÚÛÙ]/g, "U")
      .replace(/[úûù]/g, "u")
      .replace(/Ü/g, "UE")
      .replace(/ü/g, "ue")
      .replace(/[ÝŸ]/g, "Y")
      .replace(/[ýÿ]/g, "y")
      .replace(/Ž/g, "Z")
      .replace(/ž/, "z")
      .replace(/\u00d6/g, "Oe")
      .replace(/\u00f6/g, "oe")
      .replace(/\u00d6/g, "Ue")
      .replace(/\u00fc/g, "ue")
      .replace(/\u00c4/g, "Ae")
      .replace(/\u00e4/g, "ae")
      .replace(/\u00df/g, "ß")
      .replace(/\u0099/g, "Oe")
      .replace(/\u0094/g, "oe")
      .replace(/\u009A/g, "Ue")
      .replace(/\u0081/g, "ue")
      .replace(/\u008e/g, "Ae")
      .replace(/\u0084/g, "ae");
  }

  /**
   * Performs text replacements
   * @param base The base string
   * @param ext the file extension without dot!
   * @param rep The replacement configuration
   * @returns The processed string
   */
  private replace(base: string, ext: string, rep: ReplacementItem): string {
    base = base.replace(/\s+/g, " "); // replace whitespaces to normal spaces
    if (rep.checked) {
      if (!rep.ifFlag || this.ifmatch(rep.ifMatch, base)) {
        const match = rep.textFrom.match(new RegExp('^/(.*?)/([gimy]*)$'));
        const xl = ext ? ext.length+1 : 0; // for 'bat' we have to remove '.bat'!
        let _base = base.substring(0, base.length - xl);
        if (match && rep.regExpr) {
          try {
            const regex = new RegExp(match[1], match[2]);
            _base = _base.replace(regex, rep.textTo).replace(/,,/g, ',');
          } catch {
            _base = 'ERROR';
          }
        } else {
          _base = _base.replace(rep.textFrom, rep.textTo);
        }
        base = _base + (ext ? '.' + ext : '');
      }
    }

    return base;
  }

  /**
   * Checks if a pattern matches a string
   * @param what The pattern to match
   * @param base The string to check
   * @returns True if the pattern matches
   */
  private ifmatch(what: string, base: string): boolean {
    const match = what.match(new RegExp('^/(.*?)/([gimy]*)$'));
    if (match) {
      const regex = new RegExp(match[1], match[2]);
      return !!base.match(regex);
    }
    return base.indexOf(what) > -1;
  }

  /**
   * Capitalizes text according to the Chicago Manual of Style
   * @param title The text to capitalize
   * @returns The capitalized text
   */
  private titleCaps(title: string): string {
    const small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
    const punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
    const parts: string[] = [];
    const split = /[:.;?!] |(?: |^)["Ò]/g;
    let index = 0;

    const lower = (word: string): string => {
      return word.toLowerCase();
    };

    const upper = (word: string): string => {
      return word.substr(0, 1).toUpperCase() + word.substr(1);
    };

    while (true) {
      const m = split.exec(title);

      parts.push(title.substring(index, m ? m.index : title.length)
        .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
          return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
        })
        .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
        .replace(RegExp("^" + punct + small + "\\b", "ig"), function (all, punct, word) {
          return punct + upper(word);
        })
        .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));

      index = split.lastIndex;

      if (m) parts.push(m[0]);
      else break;
    }

    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
      .replace(/(['Õ])S\b/ig, "$1s")
      .replace(/\b(AT&T|Q&A)\b/ig, function (all) {
        return all.toUpperCase();
      });
  }

  /**
   * Capitalizes words in a string
   * @param s The string to capitalize
   * @returns The capitalized string
   */
  private capitalize(s: string): string {
    return s.replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  }
}

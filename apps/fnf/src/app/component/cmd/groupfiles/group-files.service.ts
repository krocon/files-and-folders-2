import {Injectable} from '@angular/core';
import {FileOperationParams} from '../../../domain/cmd/file-operation-params';
import {GroupFilesData} from './data/group-files.data';
import {PanelIndex} from '../../../domain/panel-index';
import {ActionEvent} from '../../../domain/cmd/action-event';
import {CommandService} from '../../../service/cmd/command.service';
import {FileItem, FileItemIf} from '@fnf/fnf-data';
import {GroupFilesDialogData} from './data/group-files-dialog.data';
import {GroupFilesResult} from './data/group-files-result';
import {GroupFilesRow} from './data/group-files-row';

@Injectable({
  providedIn: 'root'
})
export class GroupFilesService {

  constructor(
    // private readonly commandService: CommandService
  ) {
  }

  /**
   * Updates the target property of each row based on the multi-rename configuration
   * @param rows The file operation parameters to update
   * @param data The multi-rename configuration data
   */
  updateTargets(rows: FileOperationParams[], data: GroupFilesData): void {
    rows.forEach((row, index) => {
      if (row.source) {
        // row.target = this.rename(row.source, data, index);
      }
    });
  }

  /**
   * Creates action events for multi-rename operations
   * @param rows The file operation parameters
   * @param panelIndex The panel index
   * @returns An array of action events
   */
  createActionEvents(rows: FileOperationParams[], panelIndex: PanelIndex): ActionEvent[] {
    const actions: ActionEvent[] = [];
    return actions;
  }

  /**
   * Updates the table model based on the first letter of the file names
   * @returns The group files result
   */
  updateTableModelFirstLetter(dialogData: GroupFilesDialogData): GroupFilesResult {

    const para: GroupFilesData = dialogData.data;
    const selectedFiles: FileItemIf[] = dialogData.rows;
    const rows: GroupFilesRow[] = [];
    let i: number;
    const groups: string[] = [];
    const targetDir = para.useSourceDir ? dialogData.sourceDir : dialogData.targetDir;
    let groupCount = 0;
    let idx = 0;

    const twoLetters = para.modus.indexOf('two') > -1;
    const letterCount = twoLetters ? 2 : 1;

    for (i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      let dir = file.base;
      if (para.ignoreBrackets) {
        dir = dir
          .replace(/\[[\w\d\s]+\]/g, '')
          .replace(/\([\w\d\s]+\)/g, '');
      }
      dir = dir
        .replace(/(^[\s_-]+|[\s_-]+$)/g, '')
        .substring(0, letterCount);

      if (para.modus.indexOf('lower') > -1) dir = dir.toLowerCase();
      if (para.modus.indexOf('upper') > -1) dir = dir.toUpperCase();

      if (dir) {
        if (groups.indexOf(dir) === -1) groups.push(dir);
        rows.push(new GroupFilesRow(
          idx++,
          file.base,
          file,
          dir,
          new FileItem(targetDir + '/' + dir, file.base, file.base.split('.').pop() || '', '', 0, file.isDir)
        ));
      }
    }
    return new GroupFilesResult(groups.length, rows);
  }

  /**
   * Updates the table model based on the minus separator in the file names
   * @returns The group files result
   */
  updateTableModelMinusSeparator(dialogData: GroupFilesDialogData): GroupFilesResult {
    const para: GroupFilesData = dialogData.data;
    const selectedFiles: FileItemIf[] = dialogData.rows;
    const rows: GroupFilesRow[] = [];
    let i: number, m: RegExpMatchArray | null;
    const groups: { [key: string]: FileItemIf[] } = {};
    const minGroupSize = para.minsize;
    const targetDir = para.useSourceDir ? dialogData.sourceDir : dialogData.targetDir;
    let groupCount = 0;
    let idx = 0;

    for (i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      let name = file.base;
      let folder: string | null = null;
      if (para.ignoreBrackets) {
        name = name
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\([^\)]+\)/g, '');
      }
      m = name.match(/(.+) - (.+)/);
      if (m) {
        folder = m[1];
      } else {
        m = name.match(/(.+)-(.+)/);
        if (m) {
          folder = m[1];
        }
      }

      if (folder) {
        folder = folder.replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');
        if (!groups[folder]) groups[folder] = [];
        groups[folder].push(file);
      }
    }

    for (const dir in groups) {
      if (groups.hasOwnProperty(dir)) {
        const files = groups[dir];

        if (files.length >= minGroupSize) {
          groupCount++;
          for (i = 0; i < files.length; i++) {
            const f = files[i];
            rows.push(new GroupFilesRow(
              idx++,
              f.base,
              f,
              dir,
              new FileItem(targetDir + '/' + dir, f.base, f.base.split('.').pop() || '', '', 0, f.isDir)
            ));
          }
        }
      }
    }

    return new GroupFilesResult(groupCount, rows);
  }

  /**
   * Updates the table model based on the first word of the file names
   * @returns The group files result
   */
  updateTableModelFirstWord(dialogData: GroupFilesDialogData): GroupFilesResult {
    const para: GroupFilesData = dialogData.data;
    const selectedFiles: FileItemIf[] = dialogData.rows;
    const rows: GroupFilesRow[] = [];
    let i: number, m: RegExpMatchArray | null;
    const groups: { [key: string]: FileItemIf[] } = {};
    const minGroupSize = para.minsize;
    const targetDir = para.useSourceDir ? dialogData.sourceDir : dialogData.targetDir;
    let groupCount = 0;
    let idx = 0;

    for (i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      let name = file.base;
      let folder: string | null = null;
      if (para.ignoreBrackets) {
        name = name
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\([^\)]+\)/g, '');
      }
      m = name.match(/(\w+)\W(.+)/);
      if (m) {
        folder = m[1];
      }

      try {
        if (folder) {
          folder = folder.replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');
          if (!groups[folder]) groups[folder] = [];
          groups[folder].push(file);
        }
      } catch (e) {
        console.warn(e);
        console.warn('m', m);
        console.warn('can set property "' + folder + '"!');
      }
    }

    for (const dir in groups) {
      if (groups.hasOwnProperty(dir)) {
        const files = groups[dir];

        if (files.length >= minGroupSize) {
          groupCount++;
          for (i = 0; i < files.length; i++) {
            const f = files[i];
            rows.push(new GroupFilesRow(
              idx++,
              f.base,
              f,
              dir,
              new FileItem(targetDir + '/' + dir, f.base, f.base.split('.').pop() || '', '', 0, f.isDir)
            ));
          }
        }
      }
    }
    return new GroupFilesResult(groupCount, rows);
  }

  /**
   * Updates the table model based on running numbers in the file names
   * @returns The group files result
   */
  updateTableModelRunningNumber(dialogData: GroupFilesDialogData): GroupFilesResult {
    const para: GroupFilesData = dialogData.data;
    const selectedFiles: FileItemIf[] = dialogData.rows;
    const rows: GroupFilesRow[] = [];
    let i: number;
    const groups: { [key: string]: FileItemIf[] } = {};
    const minGroupSize = para.minsize;
    const targetDir = para.useSourceDir ? dialogData.sourceDir : dialogData.targetDir;
    let groupCount = 0;
    let idx = 0;

    for (i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      let name = file.base;

      if (para.ignoreBrackets) {
        name = name
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\([^\)]+\)/g, '');
      }

      const digits = name.match(/(\d)+/g);
      const words = name.match(/(\D)+/g);

      if (digits && digits.length >= 1 && words && words.length >= 2) {
        let folder = words[0];
        folder = folder
          .replace(/#/g, '')
          .replace(/ Band /g, '')
          .replace(/'/g, '')
          .replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');

        if (folder) {
          if (!groups[folder]) groups[folder] = [];
          groups[folder].push(file);
        }
      }
    }

    for (const dir in groups) {
      if (groups.hasOwnProperty(dir)) {
        const files = groups[dir];

        if (files.length >= minGroupSize) {
          groupCount++;
          for (i = 0; i < files.length; i++) {
            const f = files[i];
            rows.push(new GroupFilesRow(
              idx++,
              f.base,
              f,
              dir,
              new FileItem(targetDir + '/' + dir, f.base, f.base.split('.').pop() || '', '', 0, f.isDir)
            ));
          }
        }
      }
    }
    return new GroupFilesResult(groupCount, rows);
  }

  /**
   * Updates the table model based on a new folder
   * @returns The group files result
   */
  updateTableModelNewFolder(dialogData: GroupFilesDialogData): GroupFilesResult {
    const para: GroupFilesData = dialogData.data;
    const selectedFiles: FileItemIf[] = dialogData.rows;
    const rows: GroupFilesRow[] = [];
    let i: number;
    const targetDir = para.useSourceDir ? dialogData.sourceDir : dialogData.targetDir;
    const dir = para.newFolder ? para.newFolder.toString() : '';

    if (dir) {
      for (i = 0; i < selectedFiles.length; i++) {
        const f = selectedFiles[i];
        rows.push(new GroupFilesRow(
          i,
          f.base,
          f,
          dir,
          new FileItem(targetDir + '/' + dir, f.base, f.base.split('.').pop() || '', '', 0, f.isDir)
        ));
      }
    }
    return new GroupFilesResult(1, rows);
  }

  /**
   * Updates the table model based on the selected mode
   * @returns The group files result
   */
  getUpdateModel(
    dialogData: GroupFilesDialogData
  ): GroupFilesResult {
    let mode = dialogData.data.modus;
    if (mode === 'new_folder') {
      return this.updateTableModelNewFolder(dialogData);
    }
    if (mode === 'running_number') {
      return this.updateTableModelRunningNumber(dialogData);
    }
    if (mode === 'minus_separator') {
      return this.updateTableModelMinusSeparator(dialogData);
    }
    if (mode === 'first_word') {
      return this.updateTableModelFirstWord(dialogData);
    }
    if (mode.indexOf('letter') > -1) {
      return this.updateTableModelFirstLetter(dialogData);
    }

    console.warn('updateTableModel. Unknown mode:', dialogData.data.modus);
    return new GroupFilesResult(0, []);
  }

  getFileOperationParams(
    rows: GroupFilesRow[],
    srcPanelIndex: PanelIndex,
    targetPanelIndex: PanelIndex): FileOperationParams[] {

    return rows.map(r => new FileOperationParams(
      r.src, srcPanelIndex, r.target, targetPanelIndex, rows.length > CommandService.BULK_LOWER_LIMIT
    ));
  }
}

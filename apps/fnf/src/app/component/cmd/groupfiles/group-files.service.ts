import { Injectable } from '@angular/core';
import { FileOperationParams } from '../../../domain/cmd/file-operation-params';
import { GroupFilesData } from './data/group-files.data';
import { PanelIndex } from '../../../domain/panel-index';
import { ActionEvent } from '../../../domain/cmd/action-event';
import { CommandService } from '../../../service/cmd/command.service';
import { FileItemIf } from '@fnf/fnf-data';

@Injectable({
  providedIn: 'root'
})
export class GroupFilesService {

  constructor(
    private readonly commandService: CommandService
  ) { }

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

}

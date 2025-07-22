import {Injectable} from '@angular/core';
import {DOT_DOT, FileItemIf, PanelIndex} from '@fnf/fnf-data';
import {CommandService} from './cmd/command.service';
import {
  CopyOrMoveOrDeleteDialogService
} from '../component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.service';
import {CopyOrMoveOrDeleteDialogData} from '../component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.data';
import {RenameDialogService} from '../component/cmd/rename/rename-dialog.service';
import {RenameDialogData} from '../component/cmd/rename/rename-dialog.data';
import {RenameDialogResultData} from '../component/cmd/rename/rename-dialog-result.data';
import {MultiRenameDialogService} from '../component/cmd/multirename/multi-rename-dialog.service';
import {MultiRenameDialogData} from '../component/cmd/multirename/data/multi-rename-dialog.data';
import {MultiMkdirDialogService} from '../component/cmd/multimkdir/multi-mkdir-dialog.service';
import {GroupFilesDialogService} from '../component/cmd/groupfiles/group-files-dialog.service';
import {GroupFilesDialogData} from '../component/cmd/groupfiles/data/group-files-dialog.data';
import {QueueFileOperationParams} from '../domain/cmd/queue-file-operation-params';
import {QueueActionEvent} from '../domain/cmd/queue-action-event';
import {TabData} from '../domain/filepagedata/data/tab.data';
import {ActionId} from '../domain/action/fnf-action.enum';

@Injectable({
  providedIn: 'root'
})
export class FileOperationsService {

  constructor(
    private readonly commandService: CommandService,
    private readonly copyOrMoveDialogService: CopyOrMoveOrDeleteDialogService,
    private readonly renameDialogService: RenameDialogService,
    private readonly multiRenameDialogService: MultiRenameDialogService,
    private readonly multiMkdirDialogService: MultiMkdirDialogService,
    private readonly groupFilesDialogService: GroupFilesDialogService
  ) {
  }

  copy(
    selectedData: FileItemIf[],
    targetPath: string,
    getFileOperationParams: (target: FileItemIf) => QueueFileOperationParams[]
  ): void {
    const sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveOrDeleteDialogData(sources, targetPath, "copy"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = getFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForCopy(item));
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  move(
    selectedData: FileItemIf[],
    targetPath: string,
    getFileOperationParams: (target: FileItemIf) => QueueFileOperationParams[]
  ): void {
    const sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveOrDeleteDialogData(sources, targetPath, "move"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = getFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForMove(item));
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  delete(
    selectedData: FileItemIf[],
    getFileOperationParams: (target: FileItemIf) => QueueFileOperationParams[],
    onBeforeDelete?: () => void
  ): void {
    const sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveOrDeleteDialogData(sources, "", "delete"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = getFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForDel(item));
            if (onBeforeDelete) {
              onBeforeDelete();
            }
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  rename(selectedData: FileItemIf[], srcPanelIndex: PanelIndex): void {
    if (selectedData?.length === 1) {
      const source = selectedData[0];
      if (source.base === DOT_DOT) return; // skip it
      const data = new RenameDialogData(source);
      this.renameDialogService
        .open(data, (result: RenameDialogResultData | undefined) => {
          if (result) {
            const actionEvent = this.commandService.createQueueActionEventForRename(
              new QueueFileOperationParams(result.source, srcPanelIndex, result.target, srcPanelIndex)
            );
            this.commandService.addActions([actionEvent]);
          }
        });
    }
  }

  multiRename(selectedData: FileItemIf[], srcPanelIndex: PanelIndex): void {
    const rows = selectedData.filter(item => item.base !== DOT_DOT);
    if (rows?.length) {
      const data = new MultiRenameDialogData(rows, srcPanelIndex);
      this.multiRenameDialogService
        .open(data, (arr: QueueActionEvent[] | undefined) => {
          if (arr) {
            this.commandService.addActions(arr);
          }
        });
    }
  }

  multiMkdir(
    dir: string,
    panelIndex: PanelIndex,
    callActionMkDir: (para: { dir: string; base: string; panelIndex: PanelIndex }) => void,
    triggerAction: (id: ActionId) => void
  ): void {
    this.multiMkdirDialogService
      .openDialog(
        dir,
        "S[C]",
        (dirNames: string[] | undefined) => {
          if (dirNames) {
            for (const base of dirNames) {
              callActionMkDir({
                dir,
                base,
                panelIndex
              });
            }
          }
          let id = ('RELOAD_DIR_' + panelIndex) as ActionId;
          triggerAction(id);
        }
      );
  }

  groupFiles(
    selectedData: FileItemIf[],
    sourceTabData: TabData,
    srcPanelIndex: PanelIndex,
    targetTabData: TabData,
    targetPanelIndex: PanelIndex
  ): void {
    const rows = selectedData.filter(item => item.base !== DOT_DOT);
    if (rows?.length) {
      const data = new GroupFilesDialogData(
        rows,
        sourceTabData.path,
        srcPanelIndex,
        targetTabData.path,
        targetPanelIndex
      );
      this.groupFilesDialogService
        .open(data, (arr: QueueActionEvent[] | undefined) => {
          if (arr) {
            this.commandService.addActions(arr);
          }
        });
    }
  }

  open(fileItem: FileItemIf, srcPanelIndex: PanelIndex): void {
    const actionEvent = this.commandService.createQueueActionEventForOpen(
      new QueueFileOperationParams(fileItem, srcPanelIndex, fileItem, srcPanelIndex)
    );
    this.commandService.addActions([actionEvent]);
  }

  callActionMkDir(para: { dir: string; base: string; panelIndex: PanelIndex }): void {
    const actionEvent = this.commandService.createQueueActionEventForMkdir(para);
    this.commandService.addActions([actionEvent]);
  }

  onEditClicked(selectedData: FileItemIf[]): void {
    if (selectedData.length === 1) {
      localStorage.setItem('edit-selected-data', JSON.stringify(selectedData[0]));
      localStorage.setItem('edit-readonly', 'false');
      const strWindowFeatures = "location=no,height=600,width=800,scrollbars=yes,status=yes";
      const url = location.origin + "/edit.html";
      window.open(url, "_blank", strWindowFeatures);
    }
  }

  onViewClicked(selectedData: FileItemIf[]): void {
    if (selectedData.length === 1) {
      localStorage.setItem('edit-selected-data', JSON.stringify(selectedData[0]));
      localStorage.setItem('edit-readonly', 'true');
      const strWindowFeatures = "location=no,height=600,width=800,scrollbars=yes,status=yes";
      const url = location.origin + "/edit.html";
      window.open(url, "_blank", strWindowFeatures);
    }
  }

  private getSourcePaths(selectedData: FileItemIf[]): string[] {
    if (selectedData.length) {
      return selectedData.map(f => {
        return f.dir + "/" + f.base;
      });
    }
    return [];
  }
}
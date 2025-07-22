import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ActionId} from '../domain/action/fnf-action.enum';
import {CmdIf, FileItemIf} from '@fnf/fnf-data';
import {ClipboardService} from './clipboard-service';
import {ToolService} from './tool.service';
import {ShellLocalStorage} from '../component/main/footer/shellpanel/shell-local-storage';
import {TabManagementService} from './tab-management.service';
import {PanelManagementService} from './panel-management.service';
import {FileOperationsService} from './file-operations.service';
import {DialogManagementService} from './dialog-management.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  public readonly actionEvents$ = new Subject<ActionId>();
  private defaultTools: CmdIf[] = [];

  constructor(
    private readonly router: Router,
    private readonly clipboardService: ClipboardService,
    private readonly toolService: ToolService,
    private readonly shellLocalStorage: ShellLocalStorage,
    private readonly tabManagementService: TabManagementService,
    private readonly panelManagementService: PanelManagementService,
    private readonly fileOperationsService: FileOperationsService,
    private readonly dialogManagementService: DialogManagementService
  ) {
  }

  setDefaultTools(tools: CmdIf[]): void {
    this.defaultTools = tools;
  }

  getDefaultTools(): CmdIf[] {
    return this.defaultTools;
  }

  triggerAction(
    id: ActionId,
    getSelectedOrFocussedData: (panelIndex: any) => FileItemIf[],
    getSelectedOrFocussedDataForActivePanel: () => FileItemIf[],
    getActiveTabOnActivePanel: () => any,
    getOtherPanelSelectedTabData: () => any,
    createFileOperationParams: (target: FileItemIf) => any[]
  ): void {
    const panelIndex = this.panelManagementService.getActivePanelIndex();

    if (id === 'TOGGLE_PANEL') {
      this.panelManagementService.togglePanel();

    } else if (id === 'NEXT_TAB') {
      this.tabManagementService.nextTab(panelIndex);

    } else if (id === 'TOGGLE_FILTER') {
      this.tabManagementService.toggleFilter(panelIndex);

    } else if (id === 'TOGGLE_SHELL') {
      this.setShellVisible(!this.isShellVisible());

    } else if (id === 'TOGGLE_HIDDEN_FILES') {
      this.tabManagementService.toggleHiddenFiles(panelIndex);

    } else if (id === 'REMOVE_TAB') {
      this.tabManagementService.removeTab(panelIndex);

    } else if (id === 'ADD_NEW_TAB') {
      this.tabManagementService.addNewTab(panelIndex);

    } else if (id === 'SELECT_LEFT_PANEL') {
      this.panelManagementService.selectLeftPanel();

    } else if (id === 'SELECT_RIGHT_PANEL') {
      this.panelManagementService.selectRightPanel();

    } else if (id === "COPY_2_CLIPBOARD_FULLNAMES") {
      const rows = getSelectedOrFocussedData(this.panelManagementService.getActivePanelIndex());
      this.clipboardService.copyFullNames(rows);

    } else if (id === "COPY_2_CLIPBOARD_NAMES") {
      const rows = getSelectedOrFocussedData(this.panelManagementService.getActivePanelIndex());
      this.clipboardService.copyNames(rows);

    } else if (id === "COPY_2_CLIPBOARD_FULLNAMES_AS_JSON") {
      const rows = getSelectedOrFocussedData(this.panelManagementService.getActivePanelIndex());
      this.clipboardService.copyFullNamesAsJson(rows);

    } else if (id === "COPY_2_CLIPBOARD_NAMES_AS_JSON") {
      const rows = getSelectedOrFocussedData(this.panelManagementService.getActivePanelIndex());
      this.clipboardService.copyNamesAsJson(rows);

    } else if (id === "OPEN_ABOUT_DLG") {
      this.router.navigate(['/about']);

    } else if (id === "OPEN_SETUP_DLG") {
      this.router.navigate(['/setup']);

    } else if (id === "OPEN_SHELL_DLG") {
      this.router.navigate(['/shell']);

    } else if (id === "OPEN_RENAME_DLG") {
      const selectedData = getSelectedOrFocussedData(panelIndex);
      this.fileOperationsService.rename(selectedData, panelIndex);

    } else if (id === "OPEN_MULTIRENAME_DLG") {
      const selectedData = getSelectedOrFocussedData(panelIndex);
      this.fileOperationsService.multiRename(selectedData, panelIndex);

    } else if (id === "OPEN_MULTIMKDIR_DLG") {
      const activeTabData = getActiveTabOnActivePanel();
      const dir = activeTabData.path;
      this.fileOperationsService.multiMkdir(
        dir,
        panelIndex,
        (para) => this.fileOperationsService.callActionMkDir(para),
        (actionId) => this.triggerAction(actionId, getSelectedOrFocussedData, getSelectedOrFocussedDataForActivePanel, getActiveTabOnActivePanel, getOtherPanelSelectedTabData, createFileOperationParams)
      );

    } else if (id === "OPEN_GROUPFILES_DLG") {
      const selectedData = getSelectedOrFocussedData(panelIndex);
      const sourceTabData = getActiveTabOnActivePanel();
      const targetTabData = getOtherPanelSelectedTabData();
      const targetPanelIndex = this.panelManagementService.getInactivePanelIndex();
      this.fileOperationsService.groupFiles(selectedData, sourceTabData, panelIndex, targetTabData, targetPanelIndex);

    } else if (id === "OPEN_CHDIR_DLG") {
      const activeTab = getActiveTabOnActivePanel();
      const activePanelIndex = this.panelManagementService.getActivePanelIndex();
      this.dialogManagementService.openChangeDirDialog(
        activeTab.path,
        activePanelIndex,
        (evt) => {
          // This would need to be handled by the calling component
          console.log('Change dir event:', evt);
        }
      );

    } else if (id === "OPEN_FIND_DLG") {
      // This would need to be handled by the calling component
      console.log('Open find dialog');

    } else if (id === "OPEN_DELETE_EMPTY_FOLDERS_DLG") {
      // This would need to be handled by the calling component
      console.log('Open clean dialog');

    } else if (id === "OPEN_SHORTCUT_DLG") {
      this.dialogManagementService.openShortcutDialog();

    } else {
      for (const tool of this.defaultTools) {
        if (tool.id === id) {
          this.execute(tool, getSelectedOrFocussedDataForActivePanel, getActiveTabOnActivePanel);
          return;
        }
      }
      this.actionEvents$.next(id);
    }
  }

  execute(
    cmd: CmdIf,
    getSelectedOrFocussedDataForActivePanel: () => FileItemIf[],
    getActiveTabOnActivePanel: () => any
  ): void {
    const currentDir = getActiveTabOnActivePanel().path;
    const fileItems: FileItemIf[] = getSelectedOrFocussedDataForActivePanel();

    const cmds: CmdIf[] = [];
    for (let i = 0; i < fileItems.length; i++) {
      const fileItem = fileItems[i];
      const cmdClone = this.clone(cmd);
      cmdClone.para = cmdClone.para
        .replace(/\$file/g, fileItem.dir + '/' + fileItem.base)
        .replace(/\$dir/g, currentDir);
      cmds.push(cmdClone);
    }

    this.toolService.execute(cmds);
  }

  setShellVisible(visible: boolean = true): void {
    this.shellLocalStorage.setShellVisible(visible);
  }

  isShellVisible(): boolean {
    return this.shellLocalStorage.isShellVisible();
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
}
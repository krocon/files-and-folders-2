import {inject, Injectable, Injector} from "@angular/core";
import {LookAndFeelService} from "./service/look-and-feel.service";
import {ShortcutActionMapping, ShortcutService} from "./service/shortcut.service";
import {SysinfoService} from "./service/sysinfo.service";
import {FilePageDataService} from "./domain/filepagedata/file-page-data.service";
import {ConfigService} from "./service/config.service";
import {FileSystemService} from "./service/file-system.service";
import {environment} from "../environments/environment";
import {
  CmdIf,
  Config,
  DirEventIf,
  DirPara,
  DOT_DOT,
  FileItemIf,
  FindData,
  FindDialogData,
  Sysinfo,
  SysinfoIf
} from "@fnf-data";
import {BehaviorSubject, firstValueFrom, Observable, Subject} from "rxjs";
import {QueueActionEvent} from "./domain/cmd/queue-action-event";
import {PanelIndex} from "@fnf/fnf-data";
import {FilePageData} from "./domain/filepagedata/data/file-page.data";
import {DockerRootDeletePipe} from "./component/main/header/tabpanel/filemenu/docker-root-delete.pipe";
import {PanelSelectionService} from "./domain/filepagedata/service/panel-selection.service";
import {LatestDataService} from "./domain/filepagedata/service/latest-data.service";
import {FavDataService} from "./domain/filepagedata/service/fav-data.service";
import {ChangeDirEventService} from "./service/change-dir-event.service";
import {ChangeDirEvent} from "./service/change-dir-event";
import {ActionId} from "./domain/action/fnf-action.enum";
import {Theme} from "./domain/customcss/css-theme-type";
import {TabData} from "./domain/filepagedata/data/tab.data";
import {FileActionService} from "./service/cmd/file-action.service";
import {FileTableBodyModel} from "./component/main/filetable/file-table-body-model";
import {SelectionManagerForObjectModels} from "./component/main/filetable/selection-manager";
import {CopyOrMoveDialogData} from "./component/cmd/copyormove/copy-or-move-dialog.data";
import {CopyOrMoveDialogService} from "./component/cmd/copyormove/copy-or-move-dialog.service";
import {ClipboardService} from "./service/clipboard-service";
import {GotoAnythingDialogService} from "./component/cmd/gotoanything/goto-anything-dialog.service";
import {RenameDialogService} from "./component/cmd/rename/rename-dialog.service";
import {RenameDialogData} from "./component/cmd/rename/rename-dialog.data";
import {CommandService} from "./service/cmd/command.service";
import {RenameDialogResultData} from "./component/cmd/rename/rename-dialog-result.data";
import {QueueFileOperationParams} from "./domain/cmd/queue-file-operation-params";
import {MkdirDialogService} from "./component/cmd/mkdir/mkdir-dialog.service";
import {MkdirDialogData} from "./component/cmd/mkdir/mkdir-dialog.data";
import {MkdirDialogResultData} from "./component/cmd/mkdir/mkdir-dialog-result.data";
import {ShortcutDialogService} from "./component/shortcut/shortcut-dialog.service";
import {ToolService} from "./service/tool.service";
import {ActionShortcutPipe} from "./common/action-shortcut.pipe";
import {SelectionDialogService} from "./component/cmd/selection/selection-dialog.service";
import {SelectionDialogData} from "./component/cmd/selection/selection-dialog.data";
import {FiletypeExtensionsService} from "./service/filetype-extensions.service";
import {FindDialogService} from "./component/cmd/find/find-dialog.service";
import {FindSocketService} from "./service/find.socketio.service";
import {MultiRenameDialogService} from "./component/cmd/multirename/multi-rename-dialog.service";
import {MultiRenameDialogData} from "./component/cmd/multirename/data/multi-rename-dialog.data";
import {GroupFilesDialogData} from "./component/cmd/groupfiles/data/group-files-dialog.data";
import {GroupFilesDialogService} from "./component/cmd/groupfiles/group-files-dialog.service";
import {ChangeDirDialogService} from "./component/cmd/changedir/change-dir-dialog.service";
import {ChangeDirDialogData} from "./component/cmd/changedir/data/change-dir-dialog.data";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: "root"
})
export class AppService {

  public sysinfo: SysinfoIf = new Sysinfo();
  public dockerRoot: string = '';
  public config: Config | undefined = undefined;

  public favs: string[] = [];
  public latest: string[] = [];
  public winDrives: string[] = [];
  public filePageData: FilePageData = new FilePageData();

  // Observable properties
  public readonly changeDirRequest$ = new Subject<ChangeDirEvent | null>();
  public readonly dirEvents$ = new BehaviorSubject<Map<string, DirEventIf[]>>(new Map());


  public readonly actionEvents$ = new Subject<ActionId>();

  public bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined] = [undefined, undefined];
  public selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined] = [undefined, undefined];

  private injector = inject(Injector);
  private defaultTools: CmdIf[] = [];


  constructor(
    private readonly lookAndFeelService: LookAndFeelService,
    private readonly shortcutService: ShortcutService,
    private readonly sysinfoService: SysinfoService,
    private readonly filePageDataService: FilePageDataService,
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemService,
    private readonly panelSelectionService: PanelSelectionService,
    private readonly latestDataService: LatestDataService,
    private readonly favDataService: FavDataService,
    private readonly changeDirEventService: ChangeDirEventService,
    private readonly copyOrMoveDialogService: CopyOrMoveDialogService,
    private readonly clipboardService: ClipboardService,
    private readonly renameDialogService: RenameDialogService,
    private readonly mkdirDialogService: MkdirDialogService,
    private readonly commandService: CommandService,
    private readonly shortcutDialogService: ShortcutDialogService,
    private readonly toolService: ToolService,
    private readonly selectionDialogService: SelectionDialogService,
    private readonly findDialogService: FindDialogService,
    private readonly findSocketService: FindSocketService,
    private readonly multiRenameDialogService: MultiRenameDialogService,
    private readonly groupFilesDialogService: GroupFilesDialogService,
    private readonly changeDirDialogService: ChangeDirDialogService,
  ) {
    // Set config to services:
    ConfigService.forRoot(environment.config);
    SysinfoService.forRoot(environment.sysinfo);
    LookAndFeelService.forRoot(environment.lookAndFeel);
    ShortcutService.forRoot(environment.shortcut);
    FileSystemService.forRoot(environment.fileSystem);
    FileActionService.forRoot(environment.fileAction);
    GotoAnythingDialogService.forRoot(environment.gotoAnything);
    ToolService.forRoot(environment.tool);
    FiletypeExtensionsService.forRoot(environment.filetypeExtensions);

    this.favDataService
      .valueChanges()
      .subscribe(o => {
        this.favs = (o.filter((his, i, arr) => arr.indexOf(his) === i));
      });

    this.latestDataService
      .valueChanges()
      .subscribe(o => this.latest = (o.filter((his, i, arr) => arr.indexOf(his) === i)));

    this.sysinfoService
      .getDrives()
      .subscribe(winDrives => this.winDrives = winDrives);

    this.filePageDataService
      .valueChanges()
      .subscribe(data => this.filePageData = data);

    this.changeDirEventService.valueChanges()
      .subscribe(event => this.changeDirRequest$.next(event));

    this.changeDirRequest$.subscribe(changeDirEvent => {
      if (changeDirEvent) {
        this.setPathToActiveTabInGivenPanel(changeDirEvent.path, changeDirEvent.panelIndex);
      }
    });
  }

  public getVolumes$(): Observable<string[]> {
    return this.fileSystemService.getVolumes$();
  }

  favs$() {
    return this.favDataService.valueChanges();
  }

  latest$() {
    return this.latestDataService.valueChanges();
  }

  /**
   * Retrieves a unique list of history entries from all tabs across all panels.
   *
   * This method observes changes in the file page data and processes the history
   * entries from all tabs in both panels. It eliminates duplicate entries to
   * provide a consolidated history list.
   *
   * The method works by:
   * 1. Subscribing to file page data changes
   * 2. Extracting history entries from each tab in each panel
   * 3. Removing duplicate entries from the combined history
   *
   * @returns An Observable that emits an array of unique history entries (paths)
   *
   * @example
   * // Subscribe to history changes
   * this.getAllHistories$().subscribe(histories => {
   *   console.log('Current unique histories:', histories);
   *   // Example output: ['/home/user', '/usr/local', '/etc']
   * });
   *
   * // Using with async pipe in template
   * @Component({
   *   template: `
   *     <ul>
   *       <li *ngFor="let history of getAllHistories$() | async">
   *         {{ history }}
   *       </li>
   *     </ul>
   *   `
   * })
   *
   * @usageNotes
   * - The history entries are typically file system paths that have been visited
   * - The method automatically handles updates when tabs are added, removed, or modified
   * - Duplicate entries are automatically removed, keeping only the first occurrence
   * - The returned Observable continues to emit new values whenever the file page data changes
   */
  getAllHistories$(): Observable<string[]> {
    return this.filePageDataService.valueChanges()
      .pipe(
        map(filePageData => {
          const ret: string[] = [];
          filePageData.tabRows
            .forEach(tabRow => {
              tabRow.tabs
                .forEach((tab) => {
                  ret.push(tab.path);
                  ret.push(...tab.history);
                })
            });
          return ret.filter((his, i, arr) =>
            his
            && arr.indexOf(his) === i
            && !his.startsWith('tabfind')
          );
        })
      );
  }

  filePageDataChanges() {
    return this.filePageDataService.valueChanges();
  }

  public async init(callback: Function) {
    this.config = await this.configService.getConfig();
    this.dockerRoot = this.config?.dockerRoot ?? '';
    DockerRootDeletePipe.dockerRoot = this.dockerRoot;
    console.info('        > Config       :', this.config);

    // init look and feel (LaF):
    await this.lookAndFeelService.init();

    const sysInfo: SysinfoIf | undefined = await this.sysinfoService.getSysinfo();
    if (sysInfo) {
      this.sysinfo = sysInfo;
      const sys = sysInfo.osx ? 'osx' : 'windows';

      // init shortcuts:
      ActionShortcutPipe.shortcutCache = await this.shortcutService.init(sys);

      // init tools:
      const defaultTools: CmdIf[] | undefined = await this.toolService.fetchTools(sys);
      if (defaultTools) {
        this.defaultTools = defaultTools;
        const toolMappings: ShortcutActionMapping = {};
        for (const tool of defaultTools) {
          toolMappings[tool.shortcut] = tool.id;
        }
        this.shortcutService.addAdditionalShortcutMappings(toolMappings);

        console.info('        > defaultTools', defaultTools);
        console.info('        > toolMappings', toolMappings);
        console.info('        > active shortcuts', this.shortcutService.getActiveShortcuts());
      }
    }

    await this.initTabs();

    callback();
  }


  public changeDir(evt: ChangeDirEvent) {
    this.changeDirEventService.next(evt);
  }


  public async fetchDir(para: DirPara): Promise<void> {
    this.fileSystemService
      .fetchDir(para)
      .subscribe(
        {
          next: events => {
            const currentMap = this.dirEvents$.getValue();
            const newMap = new Map(currentMap);
            newMap.set(para.path, events);
            this.dirEvents$.next(newMap);
          },
          error: error => {
            console.error('Error fetching dir:', para.path);
            console.error(error);
          },
          complete: () => {
            // nothing
          }
        }
      );
  }


  public async checkPath(path: string): Promise<string> {
    return await firstValueFrom(this.fileSystemService.checkPath(path));
  }

  public updateFilePageData(fileData: FilePageData) {
    // Update both the signal and the service
    // console.info(JSON.stringify(fileData, null, 4));
    this.filePageData = this.clone(fileData);
    this.filePageDataService.update(fileData);
  }

  public async initTabs() {
    // first start ever?
    if (this.filePageData.default) {
      console.info('        > Init Tabs.....');
      try {
        const startFolder = await this.sysinfoService.getFirstStartFolder();
        console.info('        > First Start  :', startFolder);
        const v = this.clone(this.filePageData);
        v.default = false;
        v.tabRows[0].tabs[0].path = startFolder;
        v.tabRows[1].tabs[0].path = startFolder;
        this.updateFilePageData(v);

      } catch (error) {
        console.error('Error getting first start folder:', error);
      }
    }
  }

  setPanelActive(panelIndex: PanelIndex) {
    this.panelSelectionService.update(panelIndex);
  }

  getActivePanelIndex(): PanelIndex {
    return this.panelSelectionService.getValue();
  }

  getInActivePanelIndex(): PanelIndex {
    return this.panelSelectionService.getValue() ? 0 : 1;
  }

  getActiveTabOnActivePanel(): TabData {
    const pi = this.getActivePanelIndex();
    const filePageDataValue = this.filePageDataService.getValue();
    const tabsPanelDatum = filePageDataValue.tabRows[pi];
    return tabsPanelDatum.tabs[tabsPanelDatum.selectedTabIndex];
  }

  getAllHistories(): string[] {
    const ret: string[] = [];
    const filePageDataValue = this.filePageDataService.getValue();
    filePageDataValue.tabRows.forEach(tabRow => {
      tabRow.tabs.forEach((tab) => {
        ret.push(...tab.history);
      })
    })
    return ret.filter((his, i, arr) => arr.indexOf(his) === i);
  }

  addLatest(item: string) {
    this.latestDataService.addLatest(item);
  }


  triggerAction(id: ActionId) {
    // console.log('> triggerAction:', id);

    if (id === 'TOGGLE_PANEL') {
      this.panelSelectionService.toggle();

    } else if (id === 'NEXT_TAB') {
      const value = this.filePageDataService.getValue();
      const tabsPanelData = value.tabRows[this.panelSelectionService.getValue()];
      tabsPanelData.selectedTabIndex = (tabsPanelData.selectedTabIndex + 1) % tabsPanelData.tabs.length;
      this.filePageDataService.update(value);

    } else if (id === 'TOGGLE_FILTER') {
      const value = this.filePageDataService.getValue();
      const tabsPanelData = value.tabRows[this.panelSelectionService.getValue()];
      const tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
      tab.filterActive = !tab.filterActive;
      this.filePageDataService.update(value);

    } else if (id === 'REMOVE_TAB') {
      this.removeTab();

    } else if (id === 'ADD_NEW_TAB') {
      this.addNewTab();

    } else if (id === 'SELECT_LEFT_PANEL') {
      this.panelSelectionService.update(0);

    } else if (id === 'SELECT_RIGHT_PANEL') {
      this.panelSelectionService.update(1);

    } else if (id === "COPY_2_CLIPBOARD_FULLNAMES") {
      const rows = this.getSelectedOrFocussedData(this.getActivePanelIndex());
      this.clipboardService.copyFullNames(rows);

    } else if (id === "COPY_2_CLIPBOARD_NAMES") {
      const rows = this.getSelectedOrFocussedData(this.getActivePanelIndex());
      this.clipboardService.copyNames(rows);

    } else if (id === "COPY_2_CLIPBOARD_FULLNAMES_AS_JSON") {
      const rows = this.getSelectedOrFocussedData(this.getActivePanelIndex());
      this.clipboardService.copyFullNamesAsJson(rows);

    } else if (id === "COPY_2_CLIPBOARD_NAMES_AS_JSON") {
      const rows = this.getSelectedOrFocussedData(this.getActivePanelIndex());
      this.clipboardService.copyNamesAsJson(rows);

    } else if (id === "OPEN_RENAME_DLG") {
      this.rename();

    } else if (id === "OPEN_MULTIRENAME_DLG") {
      this.multiRename();

    } else if (id === "OPEN_GROUPFILES_DLG") {
      this.groupFiles();

    } else if (id === "OPEN_CHDIR_DLG") {
      this.openChangeDirDialog();

    } else if (id === "OPEN_FIND_DLG") {
      this.openFindDialog(null);

    } else if (id === "OPEN_MKDIR_DLG") {
      this.mkdir();

    } else if (id === "OPEN_SHORTCUT_DLG") {
      this.shortcutDialogService.open();

    } else {

      for (const tool of this.defaultTools) {
        if (tool.id === id) {
          this.execute(tool);
          return;
        }
      }

      console.log('> appService this.actionEventsSubject.next(id):', id);
      this.actionEvents$.next(id);
    }
  }

  debug() {
    console.clear();
    console.info('sysinfo\n', JSON.stringify(this.sysinfo, null, 4));
    console.info('config\n', JSON.stringify(this.config, null, 4));
    console.info('winDrives\n', JSON.stringify(this.winDrives, null, 4));
    console.info('latest\n', JSON.stringify(this.latest, null, 4));
    console.info('favs\n', JSON.stringify(this.favs, null, 4));
    console.info('filePageData\n', this.filePageData);
    this.bodyAreaModels.forEach((bodyAreaModel, i) => {
      if (bodyAreaModel) {
        console.info('bodyAreaModel(' + i + ') focusedRowIndex:', bodyAreaModel.focusedRowIndex);
        console.info('bodyAreaModel(' + i + ') row count', bodyAreaModel.getRowCount());
        console.info('bodyAreaModel(' + i + ') rows:', bodyAreaModel.getAllRows());
      }
    });
  }

  mkdir() {
    const panelIndex = this.getActivePanelIndex();
    const activeTabOnActivePanel = this.getActiveTabOnActivePanel();
    const dir = activeTabOnActivePanel.path;
    const focussedData = this.getFocussedData(panelIndex);
    const data = new MkdirDialogData(dir, focussedData?.base ?? '');

    this.mkdirDialogService
      .open(data, (result: MkdirDialogResultData | undefined) => {
        if (result) {
          const para = {
            dir: result.target.dir,
            base: result.target.base,
            panelIndex
          };
          this.updateFocusRowCritereaOnActivePanel({dir: para.dir, base: para.base});
          const actionEvent = this.commandService.mkdir(para);
          this.commandService.addActions([actionEvent]);
        }
      });
  }

  copy() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveDialogData(sources, this.getOtherPanelSelectedTabData().path, "copy"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.copy(item));
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  move() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const sources: string[] = this.getSourcePaths(selectedData);
    const targetPath: string = this.getOtherPanelSelectedTabData().path;

    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveDialogData(sources, targetPath, "move"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.move(item));
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  delete() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const sources: string[] = this.getSourcePaths(selectedData);

    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveDialogData(sources, "", "delete"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.del(item));
            const panelIndex = this.getActivePanelIndex();
            const bodyAreaModel = this.bodyAreaModels[panelIndex];
            if (bodyAreaModel?.focusedRowIndex) {
              bodyAreaModel.focusedRowIndex = Math.max(0, bodyAreaModel?.focusedRowIndex - selectedData.length + 1);
            }
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  setTheme(theme: Theme) {
    this.lookAndFeelService.loadAndApplyLookAndFeel(theme);
  }

  getActionByKeyEvent(keyboardEvent: KeyboardEvent): ActionId {
    return this.shortcutService.getActionByKeyEvent(keyboardEvent) as ActionId;
  }


  public async model2local(panelIndex: 0 | 1) {
    const tabData = this.getTabDataForPanelIndex(panelIndex);
    if (tabData) {
      if (tabData.path.startsWith('tabfind')) {
        this.updateFilePageData(this.filePageData);

      } else {
        try {
          const path = await this.checkPath(tabData.path);
          if (tabData.path !== path) {
            await this.setPathToActiveTabInGivenPanel(path, panelIndex);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  public onChangeDir(path: string, panelIndex: PanelIndex) {
    this.setPathToActiveTabInGivenPanel(path, panelIndex);
  }

  public async setPathToActiveTabInGivenPanel(
    path: string,
    panelIndex: PanelIndex
  ): Promise<void> {
    if (path.startsWith('tabfind')) {
      console.warn('setPathToActiveTabInGivenPanel: tabfind not supported yet');
    }
    try {
      const checkedPath: string = await this.checkPath(path);
      const fileData: FilePageData = this.filePageData;
      const tabData: TabData = this.getTabDataForPanelIndex(panelIndex);
      tabData.path = checkedPath;
      tabData.findData = undefined;

      if (ChangeDirEventService.skipNextHistoryChange) {
        ChangeDirEventService.skipNextHistoryChange = false;

        // add checkedPath on top:
        tabData.history.splice(0, 0, checkedPath);
        // remove double items:
        tabData.history = tabData.history.filter((his, i, arr) => arr.indexOf(his) === i);
        // max count = 10:
        if (tabData.history.length > 10) {
          tabData.history.length = 10;
        }
        this.addLatest(checkedPath);
      }
      // update ui:
      this.updateFilePageData(fileData);

    } catch (e) {
      console.error(e);
    }
  }

  // createHarmonizedShortcutByKeyboardEvent(keyboardEvent: KeyboardEvent): string {
  //   return this.shortcutService.createHarmonizedShortcutByKeyboardEvent(keyboardEvent);
  // }

  setBodyAreaModel(panelIndex: PanelIndex, m: FileTableBodyModel) {
    this.bodyAreaModels[panelIndex] = m;
  }

  setSelectionManagers(panelIndex: PanelIndex, m: SelectionManagerForObjectModels<FileItemIf>) {
    this.selectionManagers[panelIndex] = m;
  }

  getDirsFromAllTabs(): string[] {
    const ret: string[] = [];
    const pageData = this.filePageDataService.getValue();

    for (const tabRow of pageData.tabRows) {
      for (const tab of tabRow.tabs) {
        if (!ret.includes(tab.path)) {
          ret.push(tab.path);
        }
      }
    }
    return ret;
  }

  navigateBack() {
    const srcPanelIndex = this.getActivePanelIndex();
    const filePageDataValue = this.filePageDataService.getValue();
    const tabsPanelDatum = filePageDataValue.tabRows[srcPanelIndex];
    const tabData = tabsPanelDatum.tabs[tabsPanelDatum.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex = Math.max(0, tabData.historyIndex + 1);
    tabData.historyIndex = Math.min(tabData.historyIndex, tabData.history.length - 1);
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    this.filePageData = filePageDataValue;
    this.filePageDataService.update(this.filePageData);
    this.changeDir(new ChangeDirEvent(srcPanelIndex, path));
  }

  navigateForward() {
    const srcPanelIndex = this.getActivePanelIndex();
    const filePageDataValue = this.filePageDataService.getValue();
    const tabsPanelDatum = filePageDataValue.tabRows[srcPanelIndex];
    const tabData = tabsPanelDatum.tabs[tabsPanelDatum.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex--;
    if (tabData.historyIndex < 0) tabData.historyIndex = tabData.history.length - 1;
    if (tabData.historyIndex > tabData.history.length - 1) tabData.historyIndex = 0;
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    this.filePageData = filePageDataValue;

    this.filePageDataService.update(this.filePageData);
    this.changeDir(new ChangeDirEvent(srcPanelIndex, path));
  }


  resetFocusRowCriterea() {
    this.updateFocusRowCritereaOnActivePanel(null);
  }

  open(fileItem?: FileItemIf) {
    const srcPanelIndex = this.getActivePanelIndex();
    if (!fileItem) {
      const rows = this.getSelectedOrFocussedData(srcPanelIndex);
      if (rows?.length === 1) {
        fileItem = rows[0];
      }
    }
    if (fileItem) {
      const actionEvent = this.commandService.open(
        new QueueFileOperationParams(fileItem, srcPanelIndex, fileItem, srcPanelIndex)
      );
      this.commandService.addActions([actionEvent]);
    }
  }

  getDefaultTools(): CmdIf[] {
    return this.defaultTools;
  }

  execute(cmd: CmdIf) {
    const currentDir = this.getActiveTabOnActivePanel().path;
    const fileItems: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();

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

  openSelectionDialog(data: SelectionDialogData, cb: (result: string | undefined) => void) {
    this.selectionDialogService.open(data, cb);
  }

  getSelectedData(panelIndex: PanelIndex): FileItemIf[] {
    return this.selectionManagers[panelIndex]?.getSelectedRows() ?? [];
  }

  getSelectedOrFocussedData(panelIndex: PanelIndex): FileItemIf[] {
    let ret = this.selectionManagers[panelIndex]?.getSelectedRows() ?? [];
    if (!ret?.length && this.bodyAreaModels[panelIndex]) {
      const focusedRowIndex = this.bodyAreaModels[panelIndex]?.focusedRowIndex ?? 0;
      const frd = this.bodyAreaModels[panelIndex]?.getRowByIndex(focusedRowIndex) ?? null;
      if (frd) {
        ret = [frd];
      } else {
        ret = [];
      }
    }
    return ret ?? [];
  }

  getFirstShortcutByActionAsTokens(action: ActionId): string[] {
    return this.shortcutService.getFirstShortcutByActionAsTokens(action);
  }

  getShortcutAsLabelTokens(sc: string): string[] {
    return this.shortcutService.getShortcutAsLabelTokens(sc);
  }

  public addTab(panelIndex: PanelIndex, tabData: TabData) {
    const currentData = this.filePageData;
    const tabsPanel = currentData.tabRows[panelIndex];
    tabsPanel.tabs.push(tabData);
    tabsPanel.selectedTabIndex = tabsPanel.tabs.length - 1;
    this.updateFilePageData(currentData);
  }

  public openFindDialog(
    data: FindDialogData | null
  ) {
    const srcPanelIndex = this.getActivePanelIndex();
    if (!data) {
      data = new FindDialogData('', '**/*.ts', true, false);
      data.folders = this.getRelevantDirsFromActiveTab();
    }
    // console.info(JSON.stringify( data, null,4));
    this.findDialogService
      .open(data, (result: FindDialogData | undefined) => {
        if (result) {
          if (result.folder) {
            result.folders = result.folder.split(',');
            result.folder = '';
          }
          const findData: FindData = this.findSocketService.createFindData(result);

          if (findData.findDialogData.newtab) {
            const tabDataFindings = new TabData(findData.dirTabKey);
            tabDataFindings.findData = findData;
            this.addTab(srcPanelIndex, tabDataFindings);

          } else {
            const currentData = this.filePageData;
            const tabsPanel = currentData.tabRows[srcPanelIndex];
            const tabData = tabsPanel.tabs[tabsPanel.selectedTabIndex];
            tabData.path = findData.dirTabKey;
            tabData.findData = findData;
            this.updateFilePageData(this.filePageData);
          }
        }
      });
  }

  public openChangeDirDialog() {
    this.changeDirDialogService
      .open(
        new ChangeDirDialogData(
          this.getActiveTabOnActivePanel().path,
          this.getActivePanelIndex()
        ),
        (result: ChangeDirEvent | undefined) => {
          if (result) {
            console.info(result); // TODO
            this.changeDir(result)
          }
        });
  }

  cancelFind(findData: FindData) {
    this.findSocketService.cancelFind(findData.emmitCancelKey);
  }

  requestFindings(findData: FindData) {
    console.info('requestFindings', findData);
    this.findSocketService
      .find(findData, event => {
        const currentMap = this.dirEvents$.getValue();
        const newMap = new Map(currentMap);
        newMap.set(findData.dirTabKey, [event]);
        this.dirEvents$.next(newMap);
      });
  }

  // private updateFocusRowCritereaOnInactivePanel(focusRowCriterea: Partial<FileItemIf> | null) {
  //   this.updateFocusRowCriterea(this.getInactivePanelIndex(), focusRowCriterea);
  // }

  updateFocusRowCriterea(panelIndex: PanelIndex, focusRowCriterea: Partial<FileItemIf> | null) {
    const filePageDataValue = this.clone(this.filePageDataService.getValue());
    const panelData = filePageDataValue.tabRows[panelIndex];
    panelData.tabs[panelData.selectedTabIndex].focusRowCriterea = focusRowCriterea;
    this.updateFilePageData(filePageDataValue);
  }

  private removeTab() {
    const value = this.filePageDataService.getValue();
    const tabsPanelData = value.tabRows[this.panelSelectionService.getValue()];
    if (tabsPanelData.tabs.length > 1) {
      const selectedTabIndex = tabsPanelData.selectedTabIndex;
      tabsPanelData.tabs.splice(selectedTabIndex, 1);
      tabsPanelData.selectedTabIndex = Math.min(tabsPanelData.tabs.length - 1, selectedTabIndex);
      this.filePageDataService.update(value);
    }
  }

  private addNewTab() {
    const value = this.filePageDataService.getValue();
    const tabsPanelData = value.tabRows[this.panelSelectionService.getValue()];
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
    tabsPanelData.tabs.push(this.clone(tabData));
    tabsPanelData.selectedTabIndex = tabsPanelData.tabs.length - 1;
    this.filePageDataService.update(value);
  }

  private rename() {
    const srcPanelIndex = this.getActivePanelIndex();
    const rows = this.getSelectedOrFocussedData(srcPanelIndex);

    if (rows?.length === 1) {
      const source = rows[0];
      if (source.base === DOT_DOT) return // skip it
      const data = new RenameDialogData(source);
      this.renameDialogService
        .open(data, (result: RenameDialogResultData | undefined) => {
          if (result) {
            const actionEvent = this.commandService.rename(
              new QueueFileOperationParams(result.source, srcPanelIndex, result.target, srcPanelIndex)
            );
            this.commandService.addActions([actionEvent]);
          }
        });
    }
  }

  private multiRename() {
    const srcPanelIndex = this.getActivePanelIndex();
    const rows = this.getSelectedOrFocussedData(srcPanelIndex).filter(item => item.base !== DOT_DOT);

    if (rows?.length) {
      const data = new MultiRenameDialogData(rows, srcPanelIndex);
      //data.data =
      this.multiRenameDialogService
        .open(data, (arr: QueueActionEvent[] | undefined) => {
          if (arr) {
            this.commandService.addActions(arr);
          }
        });
    }
  }

  private groupFiles() {
    const srcPanelIndex = this.getActivePanelIndex();
    const targetPanelIndex = this.getInActivePanelIndex();
    const sourceTabData = this.getActiveTabOnActivePanel();
    const targetTabData = this.getOtherPanelSelectedTabData();
    const rows = this.getSelectedOrFocussedData(srcPanelIndex)
      .filter(item => item.base !== DOT_DOT);
    // .filter(item => !item.isDir);

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
            console.info('groupFiles ActionEvents:', arr); // TODO del
            this.commandService.addActions(arr);
          }
        });
    }
  }

  private updateFocusRowCritereaOnActivePanel(focusRowCriterea: Partial<FileItemIf> | null) {
    this.updateFocusRowCriterea(this.getActivePanelIndex(), focusRowCriterea);
  }

  private createFileOperationParams(target: FileItemIf): QueueFileOperationParams[] {
    const selectedData = this.getSelectedOrFocussedDataForActivePanel();
    const srcPanelIndex = this.getActivePanelIndex();
    const targetPanelIndex = this.getInactivePanelIndex();
    return selectedData.map(item =>
      new QueueFileOperationParams(item, srcPanelIndex, target, targetPanelIndex, selectedData.length > 1)
    );
  }

  private getInactivePanelIndex(): PanelIndex {
    return [1, 0][this.getActivePanelIndex()] as PanelIndex;
  }

  private getOtherPanelSelectedTabData(): TabData {
    const inactivePanelIndex = [1, 0][this.getActivePanelIndex()];
    const fpd: FilePageData = this.filePageData;
    return fpd.tabRows[inactivePanelIndex].tabs[fpd.tabRows[inactivePanelIndex].selectedTabIndex];
  }

  private getSourcePaths(selectedData: FileItemIf[]): string[] {
    if (selectedData.length) {
      return selectedData.map(f => {
        if (f.abs) {
          return f.base;
        }
        return f.dir + "/" + f.base;
      });
    }
    const panelIndex = this.getActivePanelIndex();
    const fpd: FilePageData = this.filePageData;
    const activeTab = fpd.tabRows[panelIndex].tabs[fpd.tabRows[panelIndex].selectedTabIndex];
    return [activeTab.path];
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private getTabDataForPanelIndex(panelIndex: 0 | 1): TabData {
    const fileData = this.filePageData;
    const tabsPanelData = fileData.tabRows[panelIndex];
    return tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
  }

  private getSelectedDataForActivePanel(): FileItemIf[] {
    return this.getSelectedData(this.getActivePanelIndex());
  }

  private getSelectedOrFocussedDataForActivePanel(): FileItemIf[] {
    return this.getSelectedOrFocussedData(this.getActivePanelIndex());
  }

  private getFocussedData(panelIndex: PanelIndex): FileItemIf | null {
    if (this.bodyAreaModels[panelIndex]) {
      const focusedRowIndex = this.bodyAreaModels[panelIndex]?.focusedRowIndex ?? 0;
      const frd = this.bodyAreaModels[panelIndex]?.getRowByIndex(focusedRowIndex) ?? null;
      return frd ?? null;
    }
    return null;
  }

  private getRelevantDirsFromActiveTab(): string[] {
    let fileItems = this.getSelectedDataForActivePanel().filter(fi => fi.isDir);
    if (fileItems.length === 1 && fileItems[0].base === DOT_DOT) {
      fileItems = [];
    }
    if (fileItems.length) {
      return fileItems.map(fi => `${fi.dir}/${fi.base}`);
    }
    return [this.getActiveTabOnActivePanel().path];
  }
}

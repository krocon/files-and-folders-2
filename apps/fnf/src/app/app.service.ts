import {Injectable, Output} from "@angular/core";
import {LookAndFeelService} from "./service/look-and-feel.service";
import {ShortcutActionMapping, ShortcutService} from "./service/shortcut.service";
import {SysinfoService} from "./service/sysinfo.service";
import {TabsPanelDataService} from "./domain/filepagedata/tabs-panel-data.service";
import {ConfigService} from "./service/config.service";
import {FileSystemService} from "./service/file-system.service";
import {environment} from "../environments/environment";
import {
  CleanDialogData,
  CmdIf,
  Config,
  DirEventIf,
  DirPara,
  DOT_DOT,
  FileItemIf,
  FindData,
  FindDialogData,
  isZipUrl,
  Sysinfo,
  SysinfoIf
} from "@fnf-data";
import {BehaviorSubject, combineLatest, firstValueFrom, Observable, Subject} from "rxjs";
import {QueueActionEvent} from "./domain/cmd/queue-action-event";
import {PanelIndex} from "@fnf/fnf-data";
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
import {CopyOrMoveOrDeleteDialogData} from "./component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.data";
import {
  CopyOrMoveOrDeleteDialogService
} from "./component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.service";
import {ClipboardService} from "./service/clipboard-service";
import {GotoAnythingDialogService} from "./component/cmd/gotoanything/goto-anything-dialog.service";
import {RenameDialogService} from "./component/cmd/rename/rename-dialog.service";
import {RenameDialogData} from "./component/cmd/rename/rename-dialog.data";
import {CommandService} from "./service/cmd/command.service";
import {RenameDialogResultData} from "./component/cmd/rename/rename-dialog-result.data";
import {QueueFileOperationParams} from "./domain/cmd/queue-file-operation-params";
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
import {TabsPanelData} from "./domain/filepagedata/data/tabs-panel.data";
import {WalkCallback, WalkSocketService} from "./service/walk.socketio.service";
import {MultiRenameAiService} from "./component/cmd/multirename/multi-rename-ai.service";
import {CleanDialogService} from "./component/cmd/clean/clean-dialog.service";


@Injectable({
  providedIn: "root"
})
export class AppService {

  private MAX_HISTORY_LENGTH = 15;

  @Output() public onKeyUp$ = new Subject<KeyboardEvent>();
  @Output() public onKeyDown$ = new Subject<KeyboardEvent>();

  public sysinfo: SysinfoIf = new Sysinfo();
  public dockerRoot: string = '';
  public config: Config | undefined = undefined;

  public favs: string[] = [];
  public latest: string[] = [];
  public winDrives: string[] = [];
  public tabsPanelDatas: [TabsPanelData, TabsPanelData] = [
    this.tabsPanelDataService.getValue(0),
    this.tabsPanelDataService.getValue(1)
  ];


  public readonly changeDirRequest$ = new Subject<ChangeDirEvent | null>();
  public readonly dirEvents$ = new BehaviorSubject<Map<string, DirEventIf[]>>(new Map());
  public readonly actionEvents$ = new Subject<ActionId>();


  public bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined] = [undefined, undefined];
  public selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined] = [undefined, undefined];
  private defaultTools: CmdIf[] = [];


  constructor(
    private readonly lookAndFeelService: LookAndFeelService,
    private readonly shortcutService: ShortcutService,
    private readonly sysinfoService: SysinfoService,
    private readonly tabsPanelDataService: TabsPanelDataService,
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemService,
    private readonly panelSelectionService: PanelSelectionService,
    private readonly latestDataService: LatestDataService,
    private readonly favDataService: FavDataService,
    private readonly changeDirEventService: ChangeDirEventService,
    private readonly copyOrMoveDialogService: CopyOrMoveOrDeleteDialogService,
    private readonly clipboardService: ClipboardService,
    private readonly renameDialogService: RenameDialogService,
    private readonly commandService: CommandService,
    private readonly shortcutDialogService: ShortcutDialogService,
    private readonly cleanDialogService: CleanDialogService,
    private readonly toolService: ToolService,
    private readonly selectionDialogService: SelectionDialogService,
    private readonly findDialogService: FindDialogService,
    private readonly findSocketService: FindSocketService,
    private readonly multiRenameDialogService: MultiRenameDialogService,
    private readonly groupFilesDialogService: GroupFilesDialogService,
    private readonly changeDirDialogService: ChangeDirDialogService,
    private readonly walkSocketService: WalkSocketService,
    private readonly multiRenameAiService: MultiRenameAiService,
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
    MultiRenameAiService.forRoot(environment.multiRename);

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

    this.tabsPanelDataService
      .valueChanges(0)
      .subscribe(data => this.tabsPanelDatas[0] = data);

    this.tabsPanelDataService
      .valueChanges(1)
      .subscribe(data => this.tabsPanelDatas[1] = data);

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
    return combineLatest([
      this.tabsPanelDataService.valueChanges(0),
      this.tabsPanelDataService.valueChanges(1)
    ])
      .pipe(
        map(tabsPanelDatas => {
          const ret: string[] = [];
          tabsPanelDatas.map(tabsPanelData => {
            tabsPanelData.tabs.forEach(tab => {
              ret.push(tab.path);
              ret.push(...tab.history);
            });
          });
          return ret;
        }),
        map(histories => histories.filter((his, i, arr) =>
          his &&
          arr.indexOf(his) === i &&
          !his.startsWith('tabfind')
        ))
      );
  }

  filePageDataChanges(panelIndex: PanelIndex): Observable<TabsPanelData> {
    return this.tabsPanelDataService.valueChanges(panelIndex);
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

  public updateTabsPanelData(panelIndex: PanelIndex, fileData: TabsPanelData) {
    // Update both the signal and the service
    // console.info(JSON.stringify(fileData, null, 4));
    this.tabsPanelDatas[panelIndex] = this.clone(fileData);
    this.tabsPanelDataService.update(panelIndex, fileData);
  }

  setPanelActive(panelIndex: PanelIndex) {
    this.panelSelectionService.update(panelIndex);
  }

  getActivePanelIndex(): PanelIndex {
    return this.panelSelectionService.getValue();
  }

  private getInActivePanelIndex(): PanelIndex {
    return this.panelSelectionService.getValue() ? 0 : 1;
  }

  getActiveTabOnActivePanel(): TabData {
    const pi = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(pi);
    return tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
  }

  getAllHistories(): string[] {
    const ret: string[] = [];
    [
      this.tabsPanelDataService.getValue(0),
      this.tabsPanelDataService.getValue(1),
    ].forEach(panelData => {
      panelData.tabs.forEach((tab) => {
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
    const panelIndex = this.panelSelectionService.getValue();
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);

    if (id === 'TOGGLE_PANEL') {
      this.panelSelectionService.toggle();

    } else if (id === 'NEXT_TAB') {
      tabsPanelData.selectedTabIndex = (tabsPanelData.selectedTabIndex + 1) % tabsPanelData.tabs.length;
      this.tabsPanelDataService.update(panelIndex, tabsPanelData);

    } else if (id === 'TOGGLE_FILTER') {
      const tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
      tab.filterActive = !tab.filterActive;
      this.tabsPanelDataService.update(panelIndex, tabsPanelData);

    } else if (id === 'TOGGLE_HIDDEN_FILES') {
      const tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
      tab.hiddenFilesVisible = !tab.hiddenFilesVisible;
      this.tabsPanelDataService.update(panelIndex, tabsPanelData);

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

    } else if (id === "OPEN_DELETE_EMPTY_FOLDERS_DLG") {
      this.openCleanDialog(null);

    } else if (id === "OPEN_SHORTCUT_DLG") {
      this.shortcutDialogService.open();

    } else {
      for (const tool of this.defaultTools) {
        if (tool.id === id) {
          this.execute(tool);
          return;
        }
      }
      // console.log('> appService this.actionEventsSubject.next(id):', id);
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
    console.info('tabsPanelDatas\n', this.tabsPanelDatas);
    this.bodyAreaModels.forEach((bodyAreaModel, i) => {
      if (bodyAreaModel) {
        console.info('bodyAreaModel(' + i + ') focusedRowIndex:', bodyAreaModel.getFocusedRowIndex());
        console.info('bodyAreaModel(' + i + ') row count', bodyAreaModel.getRowCount());
        console.info('bodyAreaModel(' + i + ') rows:', bodyAreaModel.getAllRows());
      }
    });
  }


  copy() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveOrDeleteDialogData(sources, this.getOtherPanelSelectedTabData().path, "copy"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForCopy(item));
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  move() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const sources: string[] = this.getSourcePaths(selectedData);
    const targetDir = this.getOtherPanelSelectedTabData().path;
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveOrDeleteDialogData(sources, targetDir, "move"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForMove(item));
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
        new CopyOrMoveOrDeleteDialogData(sources, "", "delete"),
        (target) => {
          if (target) {
            const paras: QueueFileOperationParams[] = this.createFileOperationParams(target);
            const actionEvents = paras.map(item => this.commandService.createQueueActionEventForDel(item));
            const panelIndex = this.getActivePanelIndex();
            const bodyAreaModel = this.bodyAreaModels[panelIndex];
            if (bodyAreaModel?.getFocusedRowIndex()) {
              bodyAreaModel.setFocusedRowIndex(Math.max(0, bodyAreaModel?.getFocusedRowIndex() - selectedData.length + 1));
            }
            this.commandService.addActions(actionEvents);
          }
        }
      );
  }

  ensureFocusIsVisible(): void {
    const panelIndex = this.getActivePanelIndex();
    const bodyAreaModel = this.bodyAreaModels[panelIndex];
    if (bodyAreaModel) {
      // TODO hier gehts weiter. dass muss evtl in die api!
      // evtl in api focussedRowIndex als setter getter!
    }
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
        this.updateTabsPanelData(panelIndex, this.tabsPanelDatas[panelIndex]);

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

    console.info('setPathToActiveTabInGivenPanel '+panelIndex, path);
    if (path.startsWith('tabfind')) {
      console.warn('setPathToActiveTabInGivenPanel: tabfind not supported yet');
    }
    try {
      let checkedPath = path;
      if (isZipUrl(path)) {
        // no path check
      } else {
        checkedPath = await this.checkPath(path);
      }


      const panelData: TabsPanelData = this.tabsPanelDatas[panelIndex];
      const tabData: TabData = panelData.tabs[panelData.selectedTabIndex];
      tabData.path = checkedPath;
      tabData.findData = undefined;

      if (!ChangeDirEventService.skipNextHistoryChange) {
        ChangeDirEventService.skipNextHistoryChange = false;

        // add checkedPath on top:
        tabData.history.splice(0, 0, checkedPath);
        // remove double items:
        tabData.history = tabData.history.filter((his, i, arr) => arr.indexOf(his) === i);
        // max count = 10:
        if (tabData.history.length > this.MAX_HISTORY_LENGTH) {
          tabData.history.length = this.MAX_HISTORY_LENGTH;
        }
        this.addLatest(checkedPath);
      }
      // update ui:
      this.updateTabsPanelData(panelIndex, panelData);

    } catch (e) {
      console.error(e);
    }
  }

  setBodyAreaModel(panelIndex: PanelIndex, m: FileTableBodyModel) {
    this.bodyAreaModels[panelIndex] = m;
  }

  setSelectionManagers(panelIndex: PanelIndex, m: SelectionManagerForObjectModels<FileItemIf>) {
    this.selectionManagers[panelIndex] = m;
  }

  getDirsFromAllTabs(): string[] {
    const ret: string[] = [];

    const tabPanelDatas = [
      this.tabsPanelDataService.getValue(0),
      this.tabsPanelDataService.getValue(1),
    ];
    for (const tabRow of tabPanelDatas) {
      for (const tab of tabRow.tabs) {
        if (!ret.includes(tab.path)) {
          ret.push(tab.path);
        }
      }
    }
    return ret;
  }

  navigateBack() {
    const panelIndex = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex = Math.max(0, tabData.historyIndex + 1);
    tabData.historyIndex = Math.min(tabData.historyIndex, tabData.history.length - 1);
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    this.tabsPanelDatas[panelIndex] = tabsPanelData;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    this.changeDir(new ChangeDirEvent(panelIndex, path));
  }

  navigateForward() {
    const panelIndex = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];

    if (!tabData.historyIndex) tabData.historyIndex = 0;
    tabData.historyIndex--;
    if (tabData.historyIndex < 0) tabData.historyIndex = tabData.history.length - 1;
    if (tabData.historyIndex > tabData.history.length - 1) tabData.historyIndex = 0;
    ChangeDirEventService.skipNextHistoryChange = true;

    const path = tabData.history[tabData.historyIndex];
    this.tabsPanelDatas[panelIndex] = tabsPanelData;

    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    this.changeDir(new ChangeDirEvent(panelIndex, path));
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
      const actionEvent = this.commandService.createQueueActionEventForOpen(
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

  private getSelectedData(panelIndex: PanelIndex): FileItemIf[] {
    return this.selectionManagers[panelIndex]?.getSelectedRows() ?? [];
  }

  getSelectedOrFocussedData(panelIndex: PanelIndex): FileItemIf[] {
    let ret = this.selectionManagers[panelIndex]?.getSelectedRows() ?? [];
    if (!ret?.length && this.bodyAreaModels[panelIndex]) {
      const focusedRowIndex = this.bodyAreaModels[panelIndex]?.getFocusedRowIndex() ?? 0;
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
    const tabsPanelData = this.tabsPanelDatas[panelIndex];

    tabsPanelData.tabs.push(tabData);
    tabsPanelData.selectedTabIndex = tabsPanelData.tabs.length - 1;
    this.updateTabsPanelData(panelIndex, tabsPanelData);
  }

  public openCleanDialog(data: CleanDialogData | null) {
    if (!data) {
      data = new CleanDialogData('', '**/*.bak', true);
      data.folders = this.getRelevantDirsFromActiveTab();
    }
    this.cleanDialogService.open(
      data,
      (result: CleanDialogData | undefined) => {
        this.actionEvents$.next('RELOAD_DIR');
      });
  }

  public openFindDialog(
    data: FindDialogData | null
  ) {
    const panelIndex = this.getActivePanelIndex();
    if (!data) {
      data = new FindDialogData('', '**/*.*', true, false);
      data.folders = this.getRelevantDirsFromActiveTab();
    }
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
            this.addTab(panelIndex, tabDataFindings);

          } else {
            const tabsPanel = this.tabsPanelDatas[panelIndex];
            const tabData = tabsPanel.tabs[tabsPanel.selectedTabIndex];
            tabData.path = findData.dirTabKey;
            tabData.findData = findData;
            this.updateTabsPanelData(panelIndex, this.tabsPanelDatas[panelIndex]);
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
            this.changeDir(result)
          }
        });
  }

  // cancelFind(findData: FindData) {
  //   this.findSocketService.cancelFind(findData.emmitCancelKey);
  // }

  requestFindings(findData: FindData) {
    this.findSocketService
      .find(findData, event => {
        const currentMap = this.dirEvents$.getValue();
        const newMap = new Map(currentMap);
        newMap.set(findData.dirTabKey, [event]);
        this.dirEvents$.next(newMap);
      });
  }


  callActionMkDir(para: { dir: string; base: string; panelIndex: PanelIndex }) {
    const actionEvent = this.commandService.createQueueActionEventForMkdir(para);
    this.commandService.addActions([actionEvent]);
  }

  private removeTab() {
    const panelIndex = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);

    if (tabsPanelData.tabs.length > 1) {
      const selectedTabIndex = tabsPanelData.selectedTabIndex;
      tabsPanelData.tabs.splice(selectedTabIndex, 1);
      tabsPanelData.selectedTabIndex = Math.min(tabsPanelData.tabs.length - 1, selectedTabIndex);
      this.tabsPanelDataService.update(panelIndex, tabsPanelData);
    }
  }

  private addNewTab() {
    const panelIndex = this.getActivePanelIndex();
    const tabsPanelData = this.tabsPanelDataService.getValue(panelIndex);
    const tabData = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
    tabsPanelData.tabs.push(this.clone(tabData));
    tabsPanelData.selectedTabIndex = tabsPanelData.tabs.length - 1;
    this.tabsPanelDataService.update(panelIndex, tabsPanelData);
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
            const actionEvent = this.commandService.createQueueActionEventForRename(
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
    const targetPanelIndex = this.getInactivePanelIndex();
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
            this.commandService.addActions(arr);
          }
        });
    }
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
    const panelData: TabsPanelData = this.tabsPanelDatas[inactivePanelIndex];
    return panelData.tabs[panelData.selectedTabIndex];
  }

  private getSourcePaths(selectedData: FileItemIf[]): string[] {
    if (selectedData.length) {
      return selectedData.map(f => {
        // if (f.abs) {
        //   return f.base;
        // }
        return f.dir + "/" + f.base;
      });
    }
    const panelIndex = this.getActivePanelIndex();
    const panelData: TabsPanelData = this.tabsPanelDatas[panelIndex];
    const activeTab = panelData.tabs[panelData.selectedTabIndex];
    return [activeTab.path];
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private getTabDataForPanelIndex(panelIndex: 0 | 1): TabData {
    const panelData: TabsPanelData = this.tabsPanelDatas[panelIndex];
    return  panelData.tabs[panelData.selectedTabIndex];
  }

  private getSelectedDataForActivePanel(): FileItemIf[] {
    return this.getSelectedData(this.getActivePanelIndex());
  }

  private getSelectedOrFocussedDataForActivePanel(): FileItemIf[] {
    return this.getSelectedOrFocussedData(this.getActivePanelIndex());
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


  walkDir(
    pathes: string[],
    callback: WalkCallback): string {
    return this.walkSocketService.walkDir(pathes, callback);
  }

  cancelWalkDir(cancelKey: string) {
    this.walkSocketService.cancelWalkDir(cancelKey);
  }

}

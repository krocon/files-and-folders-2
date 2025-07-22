import {Injectable, Output} from "@angular/core";
import {LookAndFeelService} from "./service/look-and-feel.service";
import {ShortcutActionMapping, ShortcutService} from "./service/shortcut.service";
import {SysinfoService} from "./service/sysinfo.service";
import {TabsPanelDataService} from "./domain/filepagedata/tabs-panel-data.service";
import {ConfigService} from "./service/config.service";
import {FileSystemService} from "./service/file-system.service";
import {
  AllinfoIf,
  BrowserOsType,
  CleanDialogData,
  CmdIf,
  Config,
  DirEventIf,
  DirPara,
  FileItemIf,
  FindData,
  FindDialogData,
  isZipUrl,
  PanelIndex,
  Sysinfo,
  SysinfoIf
} from "@fnf/fnf-data";
import {BehaviorSubject, combineLatest, Observable, Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {DockerRootDeletePipe} from "./component/main/header/tabpanel/filemenu/docker-root-delete.pipe";
import {LatestDataService} from "./domain/filepagedata/service/latest-data.service";
import {FavDataService} from "./domain/filepagedata/service/fav-data.service";
import {ChangeDirEventService} from "./service/change-dir-event.service";
import {ChangeDirEvent} from "./service/change-dir-event";
import {ActionId} from "./domain/action/fnf-action.enum";
import {Theme} from "./domain/customcss/css-theme-type";
import {TabData} from "./domain/filepagedata/data/tab.data";
import {FileTableBodyModel} from "./component/main/filetable/file-table-body-model";
import {SelectionManagerForObjectModels} from "./component/main/filetable/selection-manager";
import {ActionShortcutPipe} from "./common/action-shortcut.pipe";
import {ToolService} from "./service/tool.service";
import {SelectionDialogData} from "./component/cmd/selection/selection-dialog.data";
import {FindSocketService} from "./service/find.socketio.service";
import {TabsPanelData} from "./domain/filepagedata/data/tabs-panel.data";
import {BrowserOsService} from "./service/browseros/browser-os.service";
import {ShellLocalStorage} from "./component/main/footer/shellpanel/shell-local-storage";

// Import the new specialized services
import {FileOperationsService} from "./service/file-operations.service";
import {NavigationService} from "./service/navigation.service";
import {TabManagementService} from "./service/tab-management.service";
import {PanelManagementService} from "./service/panel-management.service";
import {DialogManagementService} from "./service/dialog-management.service";
import {ActionService} from "./service/action.service";
import {
  CopyOrMoveOrDeleteDialogService
} from "./component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.service";
import {GotoAnythingDialogService} from "./component/cmd/gotoanything/goto-anything-dialog.service";
import {CopyOrMoveOrDeleteDialogData} from "./component/cmd/copyormoveordelete/copy-or-move-or-delete-dialog.data";
import {GotoAnythingDialogData} from "./component/cmd/gotoanything/goto-anything-dialog.data";


@Injectable({
  providedIn: "root"
})
export class AppService {

  @Output() public onKeyUp$ = new Subject<KeyboardEvent>();
  @Output() public onKeyDown$ = new Subject<KeyboardEvent>();
  public sysinfo: SysinfoIf = new Sysinfo();
  public dockerRoot: string = '';
  public config: Config | undefined = undefined;
  public favs: string[] = [];
  public latest: string[] = [];
  public winDrives: string[] = [];
  public volumes: string[] = [];
  public tabsPanelDatas: [TabsPanelData, TabsPanelData] = [
    this.tabsPanelDataService.getValue(0),
    this.tabsPanelDataService.getValue(1)
  ];
  public readonly changeDirRequest$ = new Subject<ChangeDirEvent | null>();
  public readonly dirEvents$ = new BehaviorSubject<Map<string, DirEventIf[]>>(new Map());
  public readonly actionEvents$ = new Subject<ActionId>();
  public bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined] = [undefined, undefined];
  public selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined] = [undefined, undefined];
  public init$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private MAX_HISTORY_LENGTH = 15;
  private defaultTools: CmdIf[] = [];

  constructor(
    private readonly lookAndFeelService: LookAndFeelService,
    private readonly shortcutService: ShortcutService,
    private readonly sysinfoService: SysinfoService,
    private readonly tabsPanelDataService: TabsPanelDataService,
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemService,
    private readonly latestDataService: LatestDataService,
    private readonly favDataService: FavDataService,
    private readonly changeDirEventService: ChangeDirEventService,
    private readonly findSocketService: FindSocketService,
    private readonly browserOsService: BrowserOsService,
    private readonly toolService: ToolService,
    private readonly shellLocalStorage: ShellLocalStorage,
    // Inject the new specialized services
    private readonly fileOperationsService: FileOperationsService,
    private readonly navigationService: NavigationService,
    private readonly tabManagementService: TabManagementService,
    private readonly panelManagementService: PanelManagementService,
    private readonly dialogManagementService: DialogManagementService,
    private readonly actionService: ActionService,
    private readonly copyOrMoveOrDeleteDialogService: CopyOrMoveOrDeleteDialogService,
    private readonly gotoAnythingDialogService: GotoAnythingDialogService,
  ) {
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
        this.navigationService.setPathToActiveTabInGivenPanel(
          changeDirEvent.path,
          changeDirEvent.panelIndex,
          this.tabsPanelDatas,
          (panelIndex, fileData) => this.updateTabsPanelData(panelIndex, fileData)
        );
      }
    });

    // Subscribe to action events from ActionService
    this.actionService.actionEvents$.subscribe((actionId: ActionId) => {

      console.info('actionId', actionId);

      if (actionId === 'OPEN_COPY_DLG') {
        this.copy();

      } else if (actionId === 'OPEN_FIND_DLG') {
        this.openFindDialog(null);

      } else if (actionId === 'OPEN_DELETE_EMPTY_FOLDERS_DLG') {
        this.openCleanDialog(null);

        // } else if (actionId === 'OPEN_DELETE_DLG') {
        //   this.delete();

      } else if (actionId === 'OPEN_EDIT_DLG') {
        const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
        this.fileOperationsService.onEditClicked(selectedData);

      } else if (actionId === 'OPEN_VIEW_DLG') {
        const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
        this.fileOperationsService.onViewClicked(selectedData);

      } else if (actionId === 'OPEN_MOVE_DLG') {
        const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
        const sourcePaths = selectedData.map(item => `${item.dir}/${item.base}`);
        const activeTab = this.getActiveTabOnActivePanel();
        const data = new CopyOrMoveOrDeleteDialogData(sourcePaths, activeTab.path, "move");
        this.copyOrMoveOrDeleteDialogService.open(data, (target) => {
          if (target) {
            // Handle move operation result
            this.actionEvents$.next('RELOAD_DIR');
          }
        });

      } else if (actionId === 'OPEN_MKDIR_DLG') {
        const activeTab = this.getActiveTabOnActivePanel();
        const panelIndex = this.panelManagementService.getActivePanelIndex();
        const focussedData = this.getSelectedOrFocussedDataForActivePanel();
        const focussedBase = focussedData.length > 0 ? focussedData[0].base : '';

        this.fileOperationsService.mkdir(
          activeTab.path,
          focussedBase,
          panelIndex,
          (para) => this.fileOperationsService.callActionMkDir(para),
          (panelIndex, dirPath, criteria) => {
            // Focus persistence - simplified implementation
            // Note: Full focus persistence would require FocusLocalStorage service
          }
        );

      } else if (actionId === 'OPEN_MULTIMKDIR_DLG') {
        const activeTab = this.getActiveTabOnActivePanel();
        const panelIndex = this.panelManagementService.getActivePanelIndex();
        this.fileOperationsService.multiMkdir(
          activeTab.path,
          panelIndex,
          (para) => this.fileOperationsService.callActionMkDir(para),
          (actionId) => this.actionEvents$.next(actionId)
        );

      } else if (actionId === 'OPEN_DELETE_DLG') {
        const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
        const sourcePaths = selectedData.map(item => `${item.dir}/${item.base}`);
        const data = new CopyOrMoveOrDeleteDialogData(sourcePaths, "", "delete");
        this.copyOrMoveOrDeleteDialogService.open(data, (target) => {
          if (target) {
            // Handle delete operation result
            this.actionEvents$.next('RELOAD_DIR');
          }
        });

      } else if (actionId === 'OPEN_GOTO_ANYTHING_DLG') {
        const activeTab = this.getActiveTabOnActivePanel();
        const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
        const sourcePaths = selectedData.map(item => `${item.dir}/${item.base}`);
        const dirs = this.dialogManagementService.getRelevantDirsFromActiveTab(selectedData, activeTab.path);
        const data = new GotoAnythingDialogData('', dirs, [], sourcePaths);
        this.gotoAnythingDialogService.open(data, (result) => {
          if (result && result.value) {
            // Handle goto anything result - navigate to the selected path
            const panelIndex = this.panelManagementService.getActivePanelIndex();
            this.changeDirRequest$.next({
              path: result.value,
              panelIndex: panelIndex
            });
          }
        });
      }
    });
  }

  // Get browserOs from BrowserOs service
  public get browserOs(): BrowserOsType {
    return this.browserOsService.browserOs;
  }

  public getSysinfo$(): Observable<SysinfoIf> {
    return this.sysinfoService.getSysinfo();
  }

  public getAllinfo$(): Observable<AllinfoIf> {
    return this.sysinfoService.getAllinfo();
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


  public init(callback: Function) {
    console.info('        > Browser OS       :', this.browserOs);

    const obs: [
      Observable<Config | undefined>,
      Observable<SysinfoIf>,
      Observable<string[]>,
      Observable<AllinfoIf>,
      Observable<ShortcutActionMapping | undefined>,
      Observable<CmdIf[] | undefined>,
      // Observable<string[]>
    ] = [
      this.configService.getConfig(),
      this.sysinfoService.getSysinfo(),
      this.sysinfoService.getDrives(),
      this.sysinfoService.getAllinfo(),

      this.shortcutService.getShortcuts(this.browserOs),
      this.toolService.fetchTools(this.browserOs),
      // this.fileSystemService.getVolumes$()
    ];

    combineLatest(obs)
      .pipe(
        // Set initial values from combineLatest
        tap(([
               config,
               sysinfo,
               winDrives,
               allInfo,
               shortcutActionMapping,
               defaultTools,
               // volumes
             ]) => {
          this.config = config;
          this.dockerRoot = this.config?.dockerRoot ?? '';
          DockerRootDeletePipe.dockerRoot = this.dockerRoot;
          this.sysinfo = sysinfo;
          this.winDrives = winDrives;
          // this.volumes = volumes;

          ActionShortcutPipe.shortcutCache = shortcutActionMapping ?? {};

          if (defaultTools) {
            this.defaultTools = defaultTools;
            this.actionService.setDefaultTools(defaultTools);
            const toolMappings: ShortcutActionMapping = {};
            for (const tool of defaultTools) {
              toolMappings[tool.shortcut] = tool.id;
            }
            this.shortcutService.addAdditionalShortcutMappings(toolMappings);
            console.info('        > Tool Mappings    :', toolMappings);
          }
          // console.info('        > Volumes          :', this.volumes.join(', '));
          console.info('        > Default Tools    :', defaultTools);
          console.info('        > Active shortcuts :', this.shortcutService.getActiveShortcuts());
          console.info('        > Sysinfo          :', this.sysinfo);
          console.info('        > Config           :', this.config);
          console.info('        > All Info         :', allInfo);
        }),
      )
      .subscribe({
        next: () => {
          callback();
          this.init$.next(true);
        },
        error: (err) => {
          console.error('Error in init:', err);
          this.init$.next(false);
        }
      });
  }


  public changeDir(evt: ChangeDirEvent) {
    this.navigationService.changeDir(evt);
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
    return await this.navigationService.checkPath(path);
  }

  public async filterExists(files: string[]): Promise<string[]> {
    return await this.navigationService.filterExists(files);
  }

  public updateTabsPanelData(panelIndex: PanelIndex, fileData: TabsPanelData) {
    // Update both the signal and the service
    // console.info(JSON.stringify(fileData, null, 4));
    this.tabsPanelDatas[panelIndex] = this.clone(fileData);
    this.tabManagementService.updateTabsPanelData(panelIndex, fileData);
  }

  setPanelActive(panelIndex: PanelIndex) {
    this.panelManagementService.setPanelActive(panelIndex);
  }

  getActivePanelIndex(): PanelIndex {
    return this.panelManagementService.getActivePanelIndex();
  }

  getActiveTabOnActivePanel(): TabData {
    return this.panelManagementService.getActiveTabOnActivePanel();
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
    this.actionService.triggerAction(
      id,
      (panelIndex) => this.getSelectedOrFocussedData(panelIndex),
      () => this.getSelectedOrFocussedDataForActivePanel(),
      () => this.getActiveTabOnActivePanel(),
      () => this.getOtherPanelSelectedTabData(),
      (target) => this.createFileOperationParams(target)
    );
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
    const targetPath = this.getOtherPanelSelectedTabData().path;
    this.fileOperationsService.copy(
      selectedData,
      targetPath,
      (target) => this.createFileOperationParams(target)
    );
  }

  move() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    const targetPath = this.getOtherPanelSelectedTabData().path;
    this.fileOperationsService.move(
      selectedData,
      targetPath,
      (target) => this.createFileOperationParams(target)
    );
  }

  onEditClicked() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    this.fileOperationsService.onEditClicked(selectedData);
  }

  onViewClicked() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    this.fileOperationsService.onViewClicked(selectedData);
  }

  delete() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    this.fileOperationsService.delete(
      selectedData,
      (target) => this.createFileOperationParams(target),
      () => {
        const panelIndex = this.getActivePanelIndex();
        const bodyAreaModel = this.bodyAreaModels[panelIndex];
        if (bodyAreaModel?.getFocusedRowIndex()) {
          bodyAreaModel.setFocusedRowIndex(Math.max(0, bodyAreaModel?.getFocusedRowIndex() - selectedData.length + 1));
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
    await this.navigationService.model2local(
      panelIndex,
      this.tabsPanelDatas,
      (panelIndex, fileData) => this.updateTabsPanelData(panelIndex, fileData)
    );
  }

  public onChangeDir(path: string, panelIndex: PanelIndex) {
    this.navigationService.onChangeDir(path, panelIndex);
  }

  public async setPathToActiveTabInGivenPanel(
    path: string,
    panelIndex: PanelIndex
  ): Promise<void> {

    console.info('setPathToActiveTabInGivenPanel ' + panelIndex, path);
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
    this.panelManagementService.setBodyAreaModel(panelIndex, m, this.bodyAreaModels);
  }

  setSelectionManagers(panelIndex: PanelIndex, m: SelectionManagerForObjectModels<FileItemIf>) {
    this.panelManagementService.setSelectionManagers(panelIndex, m, this.selectionManagers);
  }

  getDirsFromAllTabs(): string[] {
    return this.navigationService.getDirsFromAllTabs();
  }

  navigateBack() {
    const panelIndex = this.getActivePanelIndex();
    this.navigationService.navigateBack(
      panelIndex,
      this.tabsPanelDatas,
      (panelIndex, fileData) => this.updateTabsPanelData(panelIndex, fileData),
      (evt) => this.changeDir(evt)
    );
  }

  navigateForward() {
    const panelIndex = this.getActivePanelIndex();
    this.navigationService.navigateForward(
      panelIndex,
      this.tabsPanelDatas,
      (panelIndex, fileData) => this.updateTabsPanelData(panelIndex, fileData),
      (evt) => this.changeDir(evt)
    );
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
      this.fileOperationsService.open(fileItem, srcPanelIndex);
    }
  }

  getDefaultTools(): CmdIf[] {
    return this.actionService.getDefaultTools();
  }

  execute(cmd: CmdIf) {
    this.actionService.execute(
      cmd,
      () => this.getSelectedOrFocussedDataForActivePanel(),
      () => this.getActiveTabOnActivePanel()
    );
  }

  openSelectionDialog(data: SelectionDialogData, cb: (result: string | undefined) => void) {
    this.dialogManagementService.openSelectionDialog(data, cb);
  }

  getSelectedOrFocussedData(panelIndex: PanelIndex): FileItemIf[] {
    return this.panelManagementService.getSelectedOrFocussedData(
      panelIndex,
      this.selectionManagers,
      this.bodyAreaModels
    );
  }

  getFirstShortcutByActionAsTokens(action: ActionId): string[] {
    return this.shortcutService.getFirstShortcutByActionAsTokens(action);
  }

  getShortcutAsLabelTokens(sc: string): string[] {
    return this.shortcutService.getShortcutAsLabelTokens(sc);
  }

  public addTab(panelIndex: PanelIndex, tabData: TabData) {
    this.tabManagementService.addTab(panelIndex, tabData);
    // Update local copy
    this.tabsPanelDatas[panelIndex] = this.tabsPanelDataService.getValue(panelIndex);
  }

  public openCleanDialog(data: CleanDialogData | null) {
    this.dialogManagementService.openCleanDialog(
      data,
      () => this.getRelevantDirsFromActiveTab(),
      this.actionEvents$
    );
  }

  public openFindDialog(
    data: FindDialogData | null
  ) {
    const panelIndex = this.getActivePanelIndex();
    this.dialogManagementService.openFindDialog(
      data,
      panelIndex,
      () => this.getRelevantDirsFromActiveTab(),
      (panelIndex, tabData) => this.addTab(panelIndex, tabData),
      (panelIndex, tabsPanelData) => this.updateTabsPanelData(panelIndex, tabsPanelData),
      this.tabsPanelDatas
    );
  }

  public openChangeDirDialog() {
    this.dialogManagementService.openChangeDirDialog(
      this.getActiveTabOnActivePanel().path,
      this.getActivePanelIndex(),
      (evt) => this.changeDir(evt)
    );
  }

  requestFindings(findData: FindData) {
    this.dialogManagementService.requestFindings(findData, this.dirEvents$);
  }

  callActionMkDir(para: { dir: string; base: string; panelIndex: PanelIndex }) {
    this.fileOperationsService.callActionMkDir(para);
  }


  setShellVisible(visible: boolean = true) {
    this.actionService.setShellVisible(visible);
  }

  isShellVisible() {
    return this.actionService.isShellVisible();
  }

  shellVisibilityChanges$(): BehaviorSubject<boolean> {
    return this.shellLocalStorage.valueChanges$();
  }


  private createFileOperationParams(target: FileItemIf): any[] {
    const selectedData = this.getSelectedOrFocussedDataForActivePanel();
    const srcPanelIndex = this.getActivePanelIndex();
    const targetPanelIndex = this.getInactivePanelIndex();
    return this.panelManagementService.createFileOperationParams(target, selectedData, srcPanelIndex, targetPanelIndex);
  }

  private getInactivePanelIndex(): PanelIndex {
    return this.panelManagementService.getInactivePanelIndex();
  }

  private getOtherPanelSelectedTabData(): TabData {
    return this.panelManagementService.getOtherPanelSelectedTabData();
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private getTabDataForPanelIndex(panelIndex: 0 | 1): TabData {
    return this.tabManagementService.getTabDataForPanelIndex(panelIndex);
  }

  private getSelectedDataForActivePanel(): FileItemIf[] {
    return this.panelManagementService.getSelectedDataForActivePanel(this.selectionManagers);
  }

  private getSelectedOrFocussedDataForActivePanel(): FileItemIf[] {
    return this.panelManagementService.getSelectedOrFocussedDataForActivePanel(this.selectionManagers, this.bodyAreaModels);
  }

  private getRelevantDirsFromActiveTab(): string[] {
    return this.dialogManagementService.getRelevantDirsFromActiveTab(
      this.getSelectedDataForActivePanel(),
      this.getActiveTabOnActivePanel().path
    );
  }


}


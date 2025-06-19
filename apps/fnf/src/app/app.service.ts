import {computed, effect, inject, Injectable, Injector, runInInjectionContext, Signal, signal} from "@angular/core";
import {LookAndFeelService} from "./service/look-and-feel.service";
import {ShortcutService} from "./service/shortcut.service";
import {SysinfoService} from "./service/sysinfo.service";
import {FilePageDataService} from "./domain/filepagedata/file-page-data.service";
import {ConfigService} from "./service/config.service";
import {FileSystemService} from "./service/file-system.service";
import {environment} from "../environments/environment";
import {Config, DirEventIf, DirPara, FileItemIf, Sysinfo, SysinfoIf} from "@fnf-data";
import {BehaviorSubject, firstValueFrom, Subject, tap} from "rxjs";
import {PanelIndex} from "./domain/panel-index";
import {FilePageData} from "./domain/filepagedata/data/file-page.data";
import {DockerRootDeletePipe} from "./component/main/header/tabpanel/filemenu/docker-root-delete.pipe";
import {PanelSelectionService} from "./domain/filepagedata/service/panel-selection.service";
import {LatestDataService} from "./domain/filepagedata/service/latest-data.service";
import {FavDataService} from "./domain/filepagedata/service/fav-data.service";
import {takeWhile} from "rxjs/operators";
import {ChangeDirEventService} from "./service/change-dir-event.service";
import {ChangeDirEvent} from "./service/change-dir-event";
import {ActionId} from "./domain/action/fnf-action.enum";
import {Theme} from "./domain/customcss/css-theme-type";
import {TabData} from "./domain/filepagedata/data/tab.data";
import {FileActionService} from "./service/cmd/file-action.service";
import {FileTableBodyModel} from "./component/main/content/filetable/file-table-body-model";
import {SelectionManagerForObjectModels} from "./component/main/content/filetable/selection-manager";
import {CopyOrMoveDialogData} from "./component/cmd/copyormove/copy-or-move-dialog.data";
import {CopyOrMoveDialogService} from "./component/cmd/copyormove/copy-or-move-dialog.service";
import {ClipboardService} from "./service/clipboard-service";
import {GotoAnythingDialogService} from "./component/cmd/gotoanything/goto-anything-dialog.service";
import {RenameDialogService} from "./component/cmd/rename/rename-dialog.service";
import {RenameDialogData} from "./component/cmd/rename/rename-dialog.data";
import {CommandService} from "./service/cmd/command.service";
import {RenameDialogResultData} from "./component/cmd/rename/rename-dialog-result.data";
import {FileOperationParams} from "./domain/cmd/file-operation-params";
import {MkdirDialogService} from "./component/cmd/mkdir/mkdir-dialog.service";
import {MkdirDialogData} from "./component/cmd/mkdir/mkdir-dialog.data";
import {MkdirDialogResultData} from "./component/cmd/mkdir/mkdir-dialog-result.data";
import {ShortcutDialogService} from "./component/shortcut/shortcut-dialog.service";

@Injectable({
  providedIn: "root"
})
export class AppService {


  // Signal properties
  public readonly favs = signal<string[]>([]);
  public readonly latest = signal<string[]>([]);
  public readonly winDrives = signal<string[]>([]);
  public readonly sysinfo = signal<SysinfoIf>(new Sysinfo());
  public readonly dockerRoot = signal<string>('');
  public readonly filePageData = signal<FilePageData>(new FilePageData());
  public readonly config = signal<Config | null>(null);
  public readonly changeDirRequest = signal<ChangeDirEvent | null>(null);


  public readonly dirEvents = signal<Map<string, DirEventIf[]>>(new Map());

  public readonly actionEvents$ = new Subject<ActionId>();

  public bodyAreaModels: [FileTableBodyModel | undefined, FileTableBodyModel | undefined] = [undefined, undefined];
  public selectionManagers: [SelectionManagerForObjectModels<FileItemIf> | undefined, SelectionManagerForObjectModels<FileItemIf> | undefined] = [undefined, undefined];

  private alive = true;
  private injector = inject(Injector);


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
  ) {
    // Set config to services:
    ConfigService.forRoot(environment.config);
    SysinfoService.forRoot(environment.sysinfo);
    LookAndFeelService.forRoot(environment.lookAndFeel);
    ShortcutService.forRoot(environment.shortcut);
    // EditDataService.forRoot(environment.edit);
    FileSystemService.forRoot(environment.fileSystem);
    FileActionService.forRoot(environment.fileAction);
    GotoAnythingDialogService.forRoot(environment.gotoAnything);

    // Initialize signals with data from observables
    this.favDataService.valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(o => {
        this.favs.set(o.filter((his, i, arr) => arr.indexOf(his) === i));
      });

    this.latestDataService.valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(o => {
        this.latest.set(o.filter((his, i, arr) => arr.indexOf(his) === i));
      });

    this.sysinfoService.getDrives()
      .pipe(takeWhile(() => this.alive))
      .subscribe(winDrives => this.winDrives.set(winDrives));

    this.sysinfoService.getSysinfo()
      .pipe(takeWhile(() => this.alive))
      .subscribe(sysinfo => this.sysinfo.set(sysinfo));

    this.configService.getConfig()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(config => {
        this.config.set(config);
        this.dockerRoot.set(config.dockerRoot);
      });

    // Initialize filePageData signal from FilePageDataService
    this.filePageDataService.valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => this.filePageData.set(data));

    // Set up effect for changeDirRequest
    // Wrap effect in runInInjectionContext to provide proper injection context
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.changeDirEventService.valueChanges()
          .pipe(
            takeWhile(() => this.alive),
            tap(console.warn)
          )
          .subscribe(event => this.changeDirRequest.set(event));
      });
    });

    // Handle directory change requests
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const changeDirEvent = this.changeDirRequest();
        if (changeDirEvent && this.alive) {
          this.setPathToActiveTabInGivenPanel(changeDirEvent.path, changeDirEvent.panelIndex);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  public async init(callback: Function) {
    // init look and feel (LaF):
    await this.lookAndFeelService.init();

    // init shortcuts:
    await this.shortcutService.init();

    // Get config using firstValueFrom instead of subscribe
    try {
      const config = await firstValueFrom(this.configService.getConfig());
      console.info('        > Config       :', config);
      DockerRootDeletePipe.dockerRoot = config.dockerRoot;
    } catch (error) {
      console.error('Error fetching config:', error);
    }

    await this.initTabs();

    callback();
  }


  public changeDir(evt: ChangeDirEvent) {
    this.changeDirEventService.next(evt);
  }


  // Methods using Signals
  public async fetchDir(para: DirPara): Promise<void> {
    this.fileSystemService
      .fetchDir(para)
      .subscribe(
        {
          next: events => {
            const currentMap = this.dirEvents();
            const newMap = new Map(currentMap);
            newMap.set(para.path, events);
            this.dirEvents.set(newMap);
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


  // public addTab(panelIndex: PanelIndex, tabData: TabData) {
  //   const currentData = this.filePageData();
  //   currentData.tabRows[panelIndex].tabs.push(tabData);
  //   this.updateFilePageData(currentData);
  // }

  public getDirEvents(path: string): Signal<DirEventIf[] | undefined> {
    return computed(() => this.dirEvents().get(path));
  }

  public async checkPath(path: string): Promise<string> {
    return await firstValueFrom(this.fileSystemService.checkPath(path));
  }

  public updateFilePageData(fileData: FilePageData) {
    // Update both the signal and the service
    this.filePageData.set(this.clone(fileData));
    this.filePageDataService.update(fileData);
  }

  public async initTabs() {
    // first start ever?
    if (this.filePageData().default) {
      console.info('        > Init Tabs.....');
      try {
        const startFolder = await firstValueFrom(this.sysinfoService.getFirstStartFolder());
        console.info('        > First Start  :', startFolder);
        const v = this.clone(this.filePageData());
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

  /**
   * Handles various actions specified by the given action identifier.
   * Executes the corresponding logic based on the action type.
   *
   * @param {ActionId} id The identifier of the action to trigger.
   * @return {void} No return value.
   */
  triggerAction(id: ActionId) {
    console.log('> triggerAction:', id);

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
      let tab = tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
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

    } else if (id === "OPEN_MKDIR_DLG") {
      this.mkdir();
    } else if (id === "OPEN_SHORTCUT_DLG") {
      this.shortcutDialogService.open();

      // } else if (id === "RELOAD_DIR") {
      //   this.filePageData.update(v=> this.clone(v));

    } else {
      console.log('> appService this.actionEventsSubject.next(id):', id);
      this.actionEvents$.next(id);
    }
  }

  debug() {
    console.clear();
    console.info('sysinfo\n', JSON.stringify(this.sysinfo(), null, 4));
    console.info('config\n', JSON.stringify(this.config(), null, 4));
    console.info('winDrives\n', JSON.stringify(this.winDrives(), null, 4));
    console.info('latest\n', JSON.stringify(this.latest(), null, 4));
    console.info('favs\n', JSON.stringify(this.favs(), null, 4));
    console.info('filePageData\n', this.filePageData());
    this.bodyAreaModels.forEach((bodyAreaModel, i) => {
      if (bodyAreaModel) {
        console.info('bodyAreaModel(' + i + ') focusedRowIndex:', bodyAreaModel.focusedRowIndex);
        console.info('bodyAreaModel(' + i + ') row count', bodyAreaModel.getRowCount());
        for (let j = 0; j < bodyAreaModel.getRowCount(); j++) {
          const row = bodyAreaModel.getRowByIndex(j);
          console.info('bodyAreaModel(' + i + ') row(' + j + '):', JSON.stringify(row, null, 0));
        }
      }
    });
  }

  copy() {
    const selectedData: FileItemIf[] = this.getSelectedOrFocussedDataForActivePanel();
    let sources: string[] = this.getSourcePaths(selectedData);
    this.copyOrMoveDialogService
      .open(
        new CopyOrMoveDialogData(sources, this.getOtherPanelSelectedTabData().path, "copy"),
        (target) => {
          if (target) {
            const paras: FileOperationParams[] = this.createFileOperationParams(target);
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
            const paras: FileOperationParams[] = this.createFileOperationParams(target);
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
            const paras: FileOperationParams[] = this.createFileOperationParams(target);
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

  onEditClicked() {
    // TODO
    // const selectedData = this.getSelectedData();
    // if (selectedData.length === 1) {
    //   const name = selectedData[0].dir + "/" + selectedData[0].base; // + '.' + selectedData[0].ext;
    //   this.editFile(name);
    // }
  }


  public async model2local(panelIndex: 0 | 1) {
    const tabData = this.getTabDataForPanelIndex(panelIndex);
    if (tabData) {
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

  public onChangeDir(path: string, panelIndex: PanelIndex) {
    this.setPathToActiveTabInGivenPanel(path, panelIndex);
  }

  public async setPathToActiveTabInGivenPanel(
    path: string,
    panelIndex: PanelIndex
  ): Promise<void> {
    try {
      const checkedPath: string = await this.checkPath(path);
      const fileData: FilePageData = this.filePageData();
      const tabData: TabData = this.getTabDataForPanelIndex(panelIndex);
      tabData.path = checkedPath;
      // add checkedPath on top:
      tabData.history.splice(0, 0, checkedPath);
      // remove double items:
      tabData.history = tabData.history.filter((his, i, arr) => arr.indexOf(his) === i);
      // max count = 10:
      if (tabData.history.length > 10) {
        tabData.history.length = 10;
      }
      this.addLatest(checkedPath);
      this.updateFilePageData(fileData);
    } catch (e) {
      console.error(e);
    }
  }

  createHarmonizedShortcutByKeyboardEvent(keyboardEvent: KeyboardEvent): string {
    return this.shortcutService.createHarmonizedShortcutByKeyboardEvent(keyboardEvent);
  }

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
    const tabData = this.getActiveTabOnActivePanel();
    const path = tabData.history.shift();
    const srcPanelIndex = this.getActivePanelIndex();
    this.changeDir(new ChangeDirEvent(srcPanelIndex, path));
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

  resetFocusRowCriterea() {
    this.updateFocusRowCritereaOnActivePanel(null);
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
      const data = new RenameDialogData(source);
      this.renameDialogService
        .open(data, (result: RenameDialogResultData | undefined) => {
          if (result) {
            const actionEvent = this.commandService.rename(
              new FileOperationParams(result.source, srcPanelIndex, result.target)
            );
            this.commandService.addActions([actionEvent]);
          }
        });
    }
  }

  private updateFocusRowCritereaOnActivePanel(focusRowCriterea: Partial<FileItemIf> | null) {
    this.updateFocusRowCriterea(this.getActivePanelIndex(), focusRowCriterea);
  }

  private updateFocusRowCritereaOnInactivePanel(focusRowCriterea: Partial<FileItemIf> | null) {
    this.updateFocusRowCriterea(this.getInactivePanelIndex(), focusRowCriterea);
  }

  private updateFocusRowCriterea(panelIndex: PanelIndex, focusRowCriterea: Partial<FileItemIf> | null) {
    const filePageDataValue = this.clone(this.filePageDataService.getValue());
    const panelData = filePageDataValue.tabRows[panelIndex];
    panelData.tabs[panelData.selectedTabIndex].focusRowCriterea = focusRowCriterea;
    this.updateFilePageData(filePageDataValue);
  }

  private createFileOperationParams(target: FileItemIf): FileOperationParams[] {
    const selectedData = this.getSelectedOrFocussedDataForActivePanel();
    // const sources: string[] = this.getSourcePaths(selectedData);
    const srcPanelIndex = this.getActivePanelIndex();
    const targetPanelIndex = this.getInactivePanelIndex();
    return selectedData.map(item =>
      new FileOperationParams(item, srcPanelIndex, target, targetPanelIndex, selectedData.length > 1)
    );
  }

  private getInactivePanelIndex(): PanelIndex {
    return [1, 0][this.getActivePanelIndex()] as PanelIndex;
  }

  private getOtherPanelSelectedTabData(): TabData {
    const inactivePanelIndex = [1, 0][this.getActivePanelIndex()];
    const fpd: FilePageData = this.filePageData();
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
    const fpd: FilePageData = this.filePageData();
    const activeTab = fpd.tabRows[panelIndex].tabs[fpd.tabRows[panelIndex].selectedTabIndex];
    return [activeTab.path];
  }


  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private getTabDataForPanelIndex(panelIndex: 0 | 1): TabData {
    const fileData = this.filePageData();
    const tabsPanelData = fileData.tabRows[panelIndex];
    return tabsPanelData.tabs[tabsPanelData.selectedTabIndex];
  }

  private getSelectedOrFocussedDataForActivePanel(): FileItemIf[] {
    return this.getSelectedOrFocussedData(this.getActivePanelIndex());
  }

  private getSelectedOrFocussedData(panelIndex: PanelIndex): FileItemIf[] {
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


  private getFocussedData(panelIndex: PanelIndex): FileItemIf | null {
    if (this.bodyAreaModels[panelIndex]) {
      const focusedRowIndex = this.bodyAreaModels[panelIndex]?.focusedRowIndex ?? 0;
      const frd = this.bodyAreaModels[panelIndex]?.getRowByIndex(focusedRowIndex) ?? null;
      return frd ?? null;
    }
    return null;
  }

}

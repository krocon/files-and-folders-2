import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RenderWrapperFactory, TableComponent} from "@guiexpert/angular-table";
import {
  AutoRestoreOptions,
  ColumnDef,
  GeMouseEvent,
  Size,
  TableApi,
  TableFactory,
  TableModelIf,
  TableOptions,
  TableOptionsIf
} from "@guiexpert/table";
import {NameCellRendererComponent} from "./renderer/name-cell-renderer.component";
import {DateCellRendererComponent} from "./renderer/date-cell-renderer.component";
import {SizeCellRendererComponent} from "./renderer/size-cell-renderer.component";
import {
  ButtonEnableStates,
  DirEventIf,
  DirPara,
  DOT_DOT,
  EXP_ZIP_FILE_URL,
  FileItem,
  FileItemIf,
  FileItemMeta,
  FindData,
  getParent,
  getZipUrlInfo,
  isRoot,
  isSameDir,
  isZipBase,
  isZipUrl,
  PanelIndex,
  ZipUrlInfo,
} from "@fnf/fnf-data";
import {fileNameComparator} from "./comparator/name-comparator";
import {extComparator} from "./comparator/ext-comparator";
import {sizeComparator} from "./comparator/size-comparator";
import {dateComparator} from "./comparator/date-comparator";
import {AppService} from "../../../app.service";
import {ChangeDirEvent} from "../../../service/change-dir-event";
import {SelectionManagerForObjectModels} from "./selection-manager";
import {FileTableBodyModel} from "./file-table-body-model";
import {TabsPanelData} from "../../../domain/filepagedata/data/tabs-panel.data";
import {Subject} from "rxjs";
import {takeWhile} from "rxjs/operators";
import {GridSelectionCountService} from "../../../service/grid-selection-count.service";
import {SelectionEvent} from "../../../domain/filepagedata/data/selection-event";
import {SelectionLocalStorage} from "./selection-local-storage";
import {GotoAnythingDialogService} from "../../cmd/gotoanything/goto-anything-dialog.service";
import {GotoAnythingDialogData} from "../../cmd/gotoanything/goto-anything-dialog.data";
import {GotoAnythingOptionData} from "../../cmd/gotoanything/goto-anything-option.data";
import {ActionId, actionIds} from "../../../domain/action/fnf-action.enum";
import {FnfActionLabels} from "../../../domain/action/fnf-action-labels";
import {NotifyService} from "../../../service/cmd/notify-service";
import {QueueNotifyEventIf} from "../../../domain/cmd/queue-notify-event.if";
import {SelectionDialogData} from "../../cmd/selection/selection-dialog.data";
import {FocusLocalStorage} from "./focus-local-storage";
import {MkdirDialogData} from "../../cmd/mkdir/mkdir-dialog.data";
import {MkdirDialogResultData} from "../../cmd/mkdir/mkdir-dialog-result.data";
import {MkdirDialogService} from "../../cmd/mkdir/mkdir-dialog.service";

@Component({
  standalone: true,
  selector: 'app-file-table',
  imports: [
    CommonModule,
    TableComponent
  ],
  templateUrl: './file-table.component.html',
  styleUrls: [
    './file-table.component.css'
  ]
})
export class FileTableComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() selected: boolean = false;
  @Output() selectionChanged = new Subject<SelectionEvent>();
  @Output() buttonStatesChanged = new Subject<ButtonEnableStates>();

  tableModel?: TableModelIf;

  private readonly rowHeight = 34;
  private readonly columnDefs = [
    ColumnDef.create({
      property: "base",
      headerLabel: "Name",
      width: new Size(100, 'weight'),
      // width: new Size(60, '%'),
      minWidth: new Size(200, 'px'),
      bodyRenderer: this.rwf.create(NameCellRendererComponent, this.cdr),
      headerClasses: ["ge-table-text-align-left"],
      bodyClasses: ["ge-table-text-align-left"],
      sortComparator: fileNameComparator
    }),
    ColumnDef.create({
      property: "ext",
      headerLabel: "Ext",
      width: new Size(60, 'px'),
      //bodyRenderer: this.rwf.create(EmailRendererComponent, this.cdr),
      headerClasses: ["ge-table-text-align-left"],
      bodyClasses: ["ge-table-text-align-left"],
      sortComparator: extComparator
    }),
    ColumnDef.create({
      property: "size",
      headerLabel: "Size",
      width: new Size(100, 'px'),
      bodyRenderer: this.rwf.create(SizeCellRendererComponent, this.cdr),
      headerClasses: ["ge-table-text-align-right"],
      bodyClasses: ["ge-table-text-align-right"],
      sortComparator: sizeComparator
    }),
    ColumnDef.create({
      property: "date",
      headerLabel: "Date",
      width: new Size(160, 'px'),
      bodyRenderer: this.rwf.create(DateCellRendererComponent, this.cdr),
      headerClasses: ["ge-table-text-align-left"],
      bodyClasses: ["ge-table-text-align-left"],
      sortComparator: dateComparator
    }),
  ];
  private readonly bodyAreaModel = new FileTableBodyModel(this.columnDefs, this.rowHeight);
  private readonly selectionManager = new SelectionManagerForObjectModels<FileItemIf>(
    this.bodyAreaModel,
    {
      isSelectable: (row: FileItemIf) => row.base !== DOT_DOT,
      isSelected: (row: FileItemIf) => (row?.meta?.selected ?? false),
      setSelected: (row: FileItemIf, selected: boolean) => {
        if (!row.meta) row.meta = new FileItemMeta();
        row.meta.selected = selected;
      },
      getKey: (row: FileItemIf) => row.dir + '/' + row.base,
      equalRows: (a: FileItemIf, b: FileItemIf) => a.base === b.base && a.dir === b.dir,
    });

  private tableApi: TableApi | undefined;
  private alive = true;
  private injector = inject(Injector);
  private hiddenFilesVisible = true;
  private filterText = "";
  private filterActive = false;
  private dirPara?: DirPara;
  //private focusRowCriterea: Partial<FileItemIf> | null = null;
  private findDataOld: FindData | undefined;

  private initialized = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rwf: RenderWrapperFactory,
    private readonly appService: AppService,
    private readonly gridSelectionCountService: GridSelectionCountService,
    public readonly gotoAnythingDialogService: GotoAnythingDialogService,
    private readonly notifyService: NotifyService,
    private readonly selectionLocalStorage: SelectionLocalStorage,
    private readonly focusLocalStorage: FocusLocalStorage,
    private readonly mkdirDialogService: MkdirDialogService,
  ) {
    this.columnDefs.forEach(def => {
      def.sortable = () => true;
      def.sortIconVisible = () => true;
    });

    this.tableModel = TableFactory.createTableModel({
      columnDefs: this.columnDefs,
      tableOptions: this.tableOptions,
      bodyAreaModel: this.bodyAreaModel
    });
  }

  private _panelIndex: PanelIndex = 0;

  readonly tableOptions: TableOptionsIf = {
    ...new TableOptions(),
    hoverColumnVisible: false,
    defaultRowHeights: {
      header: this.rowHeight,
      body: this.rowHeight,
      footer: 0
    },
    horizontalBorderVisible: false,
    verticalBorderVisible: false,
    autoRestoreOptions: {
      ...new AutoRestoreOptions<FileItemIf>(),
      getStorageKeyFn: () => `fnf-file-table-${this._panelIndex}-`,
      autoRestoreCollapsedExpandedState: true,
      autoRestoreScrollPosition: true,
      autoRestoreSortingState: true,
      autoRestoreSelectedState: false
    },
    externalFilterFunction: this.filterFn.bind(this),
    getSelectionModel: () => undefined,
    getFocusModel: () => undefined,
    shortcutActionsDisabled: true,
  };

  get panelIndex(): PanelIndex {
    return this._panelIndex;
  }

  @Input() set panelIndex(value: PanelIndex) {
    this._panelIndex = value;
  }

  private _tabsPanelData?: TabsPanelData;

  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;

    const selectedTabData = this._tabsPanelData.tabs[this._tabsPanelData.selectedTabIndex];
    //this.focusRowCriterea = selectedTabData.focusRowCriterea

    const filterChanged =
      this.filterText !== selectedTabData.filterText
      || this.filterActive !== selectedTabData.filterActive
      || this.hiddenFilesVisible !== selectedTabData.hiddenFilesVisible
    ;
    this.hiddenFilesVisible = !!selectedTabData.hiddenFilesVisible;
    this.filterText = selectedTabData.filterText ?? '';
    this.filterActive = selectedTabData.filterActive ?? false;

    if (!this.dirPara
      || this.dirPara?.path !== selectedTabData.path) {

      if (selectedTabData.findData) {
        if (this.tableApi) {
          this.tableApi.setRows([]);
          this.repaintTable();
        }
        this.dirPara = new DirPara(selectedTabData.path, `file-panel-${this._panelIndex}`);
        this.requestRows();

      } else if (!this.dirPara || this.dirPara?.path !== selectedTabData.path) {
        if (this.tableApi) {
          this.tableApi.setRows([]);
          this.repaintTable();
        }

        this.dirPara = new DirPara(selectedTabData.path, `file-panel-${this._panelIndex}`);
        this.requestRows();
      }
    }
    if (filterChanged && this.tableApi) {
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();
      this.tableApi.repaintHard();
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  reload() {
    if (this.tableApi) {
      this.tableApi.setRows([]);
      this.repaintTable();
    }
    this.requestRows();
  }

  getButtonEnableStates(items: FileItemIf[]): ButtonEnableStates {
    const states = new ButtonEnableStates();
    states.copy = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    states.edit = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    states.move = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    states.remove = !!items?.length && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    states.mkdir = true;
    states.rename = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    states.unpack = items?.length === 1 && !items[0].dir?.match(EXP_ZIP_FILE_URL);
    return states;
  }

  ngOnInit(): void {
    this.appService.setBodyAreaModel(this._panelIndex, this.bodyAreaModel);
    this.appService.setSelectionManagers(this._panelIndex, this.selectionManager);

    // Subscribe to selection$ changes
    this.selectionManager.selection$
      .subscribe(selectedRows => {
        this.calcButtonStates(selectedRows);
      });

    this.appService.dirEvents$
      .pipe(takeWhile(() => this.alive))
      .subscribe(dirEventsMap => {
        if (this.dirPara?.path) {
          let dirEvents = dirEventsMap.get(this.dirPara.path);
          if (dirEvents) this.handleDirEvent(dirEvents);
        }
      });

    this.appService.actionEvents$
      .pipe(takeWhile(() => this.alive))
      .subscribe(actionEvent => {
        if (actionEvent && this.alive && this.selected) {
          this.actionCall(actionEvent);
        }
      });

    this.notifyService
      .valueChanges()
      .subscribe(
        (evt: QueueNotifyEventIf) => {
          if (Array.isArray(evt.data)) {
            const arr = evt.data as Array<DirEventIf>;
            this.handleDirEvent(arr);
          }
        }
      )
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onMouseClicked(evt: GeMouseEvent) {
    if (evt.clickCount === 2 && evt.areaIdent === 'body' && this.tableModel) {
      const fileItem: FileItemIf = this.bodyAreaModel.getRowByIndex(evt.rowIndex);

      console.info(fileItem.base, isZipBase(fileItem.base))
      if (isZipBase(fileItem.base)) {
        this.changeDir(fileItem);
      } else if (fileItem.isDir) {
        this.changeDir(fileItem);
      } else {
        this.appService.open(fileItem);
      }

    } else if (evt.clickCount === 1 && evt.areaIdent === 'body' && this.tableModel) {
      if (this.tableApi) {
        if (evt.rowIndex > -1) this.setFocus2Index(evt.rowIndex);
        this.selectionManager.handleGeMouseEvent(evt);
      }
    }
    if (this.tableApi) {
      this.tableApi?.repaint();
    }
  }


  onKeyUp(evt: KeyboardEvent) {
    this.selectionManager.handleKeyUpEvent(evt);
  }
  onKeyDown(evt: KeyboardEvent) {
    this.selectionManager.handleKeyDownEvent(evt);
  }

  async requestRows(): Promise<void> {
    let findData: FindData | undefined = undefined;
    if (this._tabsPanelData) {
      const selectedTabData = this._tabsPanelData.tabs[this._tabsPanelData.selectedTabIndex];
      if (selectedTabData.findData) {
        findData = selectedTabData.findData;
      }
    }

    if (findData) {
      if (this.findDataOld) {
        // TODO this.appService.cancelFind(findData);
      }
      this.findDataOld = structuredClone(findData);
      // request findings:
      this.appService.requestFindings(findData);

    } else if (this.dirPara) {
      // request directory entries
      try {
        await this.appService.fetchDir(this.dirPara);
      } catch (e) {
        console.error(e);
      }
    }
  }


  handleDirEvent(dirEvents: DirEventIf[]): void {
    if (this.tableApi && dirEvents && this.dirPara) {
      for (let i = 0; i < dirEvents.length; i++) {
        const dirEvent = dirEvents[i];
        const zi: ZipUrlInfo = getZipUrlInfo(this.dirPara.path);

        if (this.dirPara.path.startsWith('tabfind')
          || this.isRelevantDir(dirEvent.dir, this.dirPara.path, zi)) {
          this.handleRelevantDirEvent(dirEvent, zi);
        }
      }
    }
  }


  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi;
    this.selectionManager.tableApi = tableApi;
  }


  actionCall(action: string) {
    if (action === 'RELOAD_DIR') {
      this.reload();

    } else if (action === 'SELECT_ALL') {
      this.selectionManager.selectionAll();
      this.tableApi?.repaint();

    } else if (action === 'DESELECT_ALL') {
      this.selectionManager.deSelectionAll();
      this.tableApi?.repaint();

    } else if (action === 'TOGGLE_SELECTION') {
      this.selectionManager.toggleSelection();
      this.tableApi?.repaint();

    } else if (action === 'TOGGLE_SELECTION_CURRENT_ROW') {
      const row = this.bodyAreaModel.getRowByIndex(this.bodyAreaModel.focusedRowIndex);
      this.selectionManager.toggleRowSelection(row);
      this.tableApi?.repaint();

    } else if (action === "ENHANCE_SELECTION") {
      this.openSelectionDialog(true);

    } else if (action === "REDUCE_SELECTION") {
      this.openSelectionDialog(false);

    // } else if (action === "SPACE_PRESSED") {
      // const r = this.bodyAreaModel.focusedRowIndex;
      // if (r > -1) {
      //   const row = this.bodyAreaModel.getRowByIndex(r);
      //   this.selectionManager.toggleRowSelection(row);
      //   this.tableApi?.repaint();
      // }

    } else if (action === "ENTER_PRESSED") {
      const r = this.bodyAreaModel.focusedRowIndex;
      if (r > -1) {
        const row = this.bodyAreaModel.getRowByIndex(r);

        if (isZipBase(row.base)) {
          this.changeDir(row);

        } else if (row?.isDir) {
          this.changeDir(row);

        } else {
          if (!isZipUrl(row.dir)) {
            this.appService.open(row);
          } else {
            // TODO later
          }

        }
      }


    } else if (action === "HOME_PRESSED") {
      this.setFocus2Index(0);

    } else if (action === "END_PRESSED") {
      this.setFocus2Index(Math.max(0, this.bodyAreaModel.getRowCount() - 1));

    } else if (action === "ARROW_UP") {
      this.setFocus2Index(Math.max(0, this.bodyAreaModel.focusedRowIndex - 1));

    } else if (action === "ARROW_DOWN") {
      this.setFocus2Index(Math.min(this.bodyAreaModel.getRowCount() - 1, this.bodyAreaModel.focusedRowIndex + 1));

    } else if (action === "PAGEUP_PRESSED") {
      this.setFocus2Index(Math.max(0, this.bodyAreaModel.focusedRowIndex - this.getDisplayedRowCount() + 1));

    } else if (action === "PAGEDOWN_PRESSED") {
      this.setFocus2Index(Math.min(this.bodyAreaModel.getRowCount() - 1, this.bodyAreaModel.focusedRowIndex + this.getDisplayedRowCount() + 1));

    } else if (action === "NAVIGATE_LEVEL_DOWN") {
      const fileItem = this.bodyAreaModel.getRowByIndex(0);
      if (fileItem.isDir) {
        if (fileItem.base === DOT_DOT) {
          this.appService.changeDir(new ChangeDirEvent(this._panelIndex, fileItem.dir));
        }
      }
    } else if (action === "OPEN_MKDIR_DLG") {
      this.openMakeDirDlg();

    } else if (action === 'OPEN_GOTO_ANYTHING_DLG') {
      const activeTabOnActivePanel = this.appService.getActiveTabOnActivePanel();
      const firstInput = activeTabOnActivePanel.path;
      const firstOptions: string[] = [];
      const dirs: string[] =
        [
          ...this.appService.getDirsFromAllTabs(),
          ...this.appService.getAllHistories(),
        ]
          .filter((his, i, arr) => arr.indexOf(his) === i) // remove double entries
          .sort();

      const commands: GotoAnythingOptionData[] = actionIds.map((id) => {
        return new GotoAnythingOptionData(id, FnfActionLabels.getLabel(id))
      })

      this.gotoAnythingDialogService.open(
        new GotoAnythingDialogData(
          firstInput,
          dirs,
          commands,
          firstOptions
        ),
        (result: GotoAnythingOptionData | undefined) => {
          if (result) {
            if (result.cmd === 'cd') {
              this.appService.onChangeDir(result.value, this._panelIndex);
            } else {
              this.appService.triggerAction(result.cmd as ActionId);
            }
          }
        }
      )

    } else if (action === "NAVIGATE_BACK") {
      this.appService.navigateBack();
    } else if (action === "NAVIGATE_FORWARD") {
      this.appService.navigateForward();
    }
  }

  openMakeDirDlg() {
    const panelIndex = this.panelIndex;
    const activeTabOnActivePanel = this.appService.getActiveTabOnActivePanel();
    const dir = this.dirPara?.path ?? activeTabOnActivePanel.path;
    const focussedData = this.getFocussedData();
    const data = new MkdirDialogData(dir, focussedData?.base ?? '');

    this.mkdirDialogService
      .open(data, (result: MkdirDialogResultData | undefined) => {
        if (result && this.dirPara?.path) {
          const para = {
            dir: result.target.dir,
            base: result.target.base,
            panelIndex
          };
          this.focusLocalStorage.persistFocusCriteria(this.panelIndex,this.dirPara.path,  {dir: para.dir, base: para.base});
          this.appService.callActionMkDir(para);
        }
      });
  }

  private getFocussedData(): FileItemIf | null {
    if (this.bodyAreaModel) {
      const focusedRowIndex = this.bodyAreaModel.focusedRowIndex ?? 0;
      const frd = this.bodyAreaModel.getRowByIndex(focusedRowIndex) ?? null;
      return frd ?? null;
    }
    return null;
  }

  setFocus2Index(index: number) {
    this.bodyAreaModel.focusedRowIndex = index;
    const partial = this.bodyAreaModel.getCriteriaFromFocussedRow();

    const activeTabOnActivePanel = this.appService.getActiveTabOnActivePanel();
    const dir = this.dirPara?.path ?? activeTabOnActivePanel.path;

    this.focusLocalStorage.persistFocusCriteria(this.panelIndex, dir, partial);
    this.tableApi?.repaint();

    const selectedRows = this.selectionManager.getSelectionValue();
    this.calcButtonStates(selectedRows);
  }

  private openSelectionDialog(enhance: boolean) {
    const rows = this.appService.getSelectedOrFocussedData(this.panelIndex);
    const s = rows.length ? rows[0].ext : '';
    this.appService.openSelectionDialog(
      new SelectionDialogData(s, enhance),
      (data) => this.handleSelectionDialogResult(data, enhance));
  }

  private handleSelectionDialogResult(data: string | undefined, enhance: boolean) {
    if (data) {
      const fs = data.toLowerCase().split(' ');

      const negs = fs?.filter(f => f.startsWith('-'))
        .map(f => f.substring(1).trim())
        .filter(f => f);

      const poss = fs?.filter(f => !f.startsWith('-'))
        .map(f => f.replace(/^\+/g, '').trim())
        .filter(f => f);

      const rows = this.bodyAreaModel
        .getFilteredRows()
        .filter(r =>
            r.base !== DOT_DOT
            && poss.every(f => {
              if (f.includes('|')) {
                const ors = f.split('|');
                return ors.some(or => r.base.toLowerCase().includes(or));
              }
              return r.base.toLowerCase().includes(f)
            })
            && negs.every(f => {
              if (f.includes('|')) {
                const ors = f.split('|');
                return !ors.some(or => r.base.toLowerCase().includes(or));
              }
              return !r.base.toLowerCase().includes(f);
            })
        );
      rows.forEach(r => this.selectionManager.setRowSelected(r, enhance));
      this.selectionManager.updateSelection()
      this.tableApi?.repaint();
    }
  }

  private calcButtonStates<T>(selectedRows: FileItemIf[]) {
    if (this.dirPara?.path && this.initialized) {
      this.selectionLocalStorage.persistSelection(this.panelIndex, this.dirPara.path, this.selectionManager);
    }
    const selectionLabelData: SelectionEvent = this.gridSelectionCountService
      .getSelectionCountData(
        selectedRows,
        this.bodyAreaModel?.getFilteredRows() ?? []
      );
    this.selectionChanged.next(selectionLabelData);

    let rows: FileItemIf[] = [...selectedRows];
    if (rows.length === 0
      && this.bodyAreaModel.focusedRowIndex > -1
      && this.bodyAreaModel.focusedRowIndex < this.bodyAreaModel.getRowCount()) {
      const rowByIndex = this.bodyAreaModel.getRowByIndex(this.bodyAreaModel.focusedRowIndex);
      if (rowByIndex.base !== DOT_DOT) {
        rows = [rowByIndex];
      }
    }
    this.buttonStatesChanged.next(this.getButtonEnableStates(rows));
  }

  private handleRelevantDirEvent(dirEvent: DirEventIf, zi: ZipUrlInfo) {
    if (!this.tableApi || !dirEvent || !this.dirPara) return;

    if (dirEvent.action === "list") {
      let rows: FileItemIf[] = [];

      if (!dirEvent.end) {
        rows = [...this.bodyAreaModel.getAllRows()];
      }
      if (dirEvent.items) {
        rows = [...rows,
          ...dirEvent.items.filter(fi => (
            fi.dir === this.dirPara?.path
            || this.dirPara?.path.startsWith('tabfind')
            || isSameDir(fi.dir, this.dirPara?.path ?? '')
            || isRoot(fi.dir) && isRoot(zi.zipInnerUrl))
          )];
      }
      if (!isRoot(this.dirPara.path)
        && !this.dirPara?.path.startsWith('tabfind')
        && !rows.find(r => r.base === DOT_DOT)
      ) {
        // Adding '..' as the first item (parent dir):
        rows = [
          new FileItem(getParent(this.dirPara.path), DOT_DOT, "", "", 1, true),
          ...rows
        ];
      }

      if (this.tableApi) {
        this.setRows(rows);

        const selectionLabelData: SelectionEvent = this.gridSelectionCountService
          .getSelectionCountData(
            [],
            this.bodyAreaModel?.getFilteredRows() ?? []
          );
        this.selectionChanged.next(selectionLabelData);
      }

      if (dirEvent.end) {
        //
      }

    } else if (dirEvent.action === "add" || dirEvent.action === "addDir") {
      this.tableApi.addRows(dirEvent.items)
      this.repaintTable();
      this.selectionManager.updateSelection();

    } else if (dirEvent.action === "checkOrAddDir" || dirEvent.action === "checkOrAddFile") {
      const exists: boolean = this.tableApi
        .findRows(
          dirEvent.items,
          (a, b) => a.base === b.base && a.dir === b.dir).length > 0;

      if (!exists) {
        this.tableApi.addRows(dirEvent.items);
        this.repaintTable();
        this.selectionManager.updateSelection();
      }

    } else if (dirEvent.action === "unlink" || dirEvent.action === "unlinkDir") {
      this.tableApi.removeRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir);
      this.bodyAreaModel.focusedRowIndex = Math.min(this.bodyAreaModel.getRowCount() - 1, this.bodyAreaModel.focusedRowIndex);
      this.repaintTable();
      this.selectionManager.updateSelection();

    } else if (dirEvent.action === "change") {
      this.tableApi.updateRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir);
      this.repaintTable();

    } else if (dirEvent.action === "focus") {
      const focusRowCriterea = dirEvent.items[0];
      this.focusLocalStorage.persistFocusCriteria(this.panelIndex, this.dirPara?.path, focusRowCriterea);
      this.focusLocalStorage.applyFocus(this.panelIndex, this.dirPara?.path, this.bodyAreaModel);
      this.repaintTable();

    } else if (dirEvent.action === "unselect") {
      this.tableApi.findRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir)
        .forEach(r => {
          this.setFileItemSelected(r, false);
          this.selectionManager.setRowSelected(r, false);
        });
      this.selectionManager.updateSelection();
      this.repaintTable();

    } else if (dirEvent.action === "unselectall") {
      this.bodyAreaModel.getAllRows().forEach(r => this.setFileItemSelected(r, false));
      this.selectionManager.clear();
      this.selectionManager.updateSelection();
      this.repaintTable();

    } else if (dirEvent.action === "select") {
      this.tableApi.findRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir)
        .forEach(r => {
          this.setFileItemSelected(r, true);
          this.selectionManager.setRowSelected(r, true);
        });
      this.selectionManager.updateSelection();
      this.repaintTable();

    } else {
      console.warn("Unknown dir changedir action:", dirEvent);
    }
  }

  private setFileItemSelected(fileItem: FileItemIf, selected: boolean) {
    if (!fileItem.meta) {
      fileItem.meta = new FileItemMeta();
      fileItem.meta.selected = selected;
    }
  }


  private setRows(fileItems: FileItemIf[]): void {
    if (this.tableApi) {
      this.tableApi.setRows(fileItems);
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();

      if (this.dirPara?.path) {
        this.selectionLocalStorage?.applySelection(this.panelIndex, this.dirPara?.path, this.selectionManager);
        this.focusLocalStorage.applyFocus(this.panelIndex, this.dirPara?.path, this.bodyAreaModel);
      }

      this.tableApi.repaintHard();
    }
  }

  // private updateFocusIndexByCriteria() {
  //   if (this.focusRowCriterea) {
  //     const rowIndex = this.bodyAreaModel.getRowIndexByCriteria(this.focusRowCriterea);
  //     this.setFocus2Index(rowIndex ?? 0);
  //   }
  // }

  private repaintTable() {
    if (this.tableApi) {
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();
      this.tableApi.repaintHard();
      this.tableApi.repaintHard();
    }
  }

  private getDisplayedRowCount(): number {
    if (this.tableApi) return this.tableApi.getDisplayedRowCount();
    return 10;
  }

  private changeDir(fileItem: FileItemIf) {
    if (!fileItem) {
      return; // skip
    }
    if (fileItem.isDir) {

      // update focus criteria:
      // if (fileItem.base === DOT_DOT) {
      //   const p = getParentDir(this.dirPara?.path ?? '');
      //   this.focusRowCriterea = {dir: p.dir, base: p.base};
      //   this.appService.updateFocusRowCriterea(this.panelIndex, this.focusRowCriterea);
      // } else {
      //   this.focusRowCriterea = {dir: fileItem.dir, base: DOT_DOT};
      //   this.appService.updateFocusRowCriterea(this.panelIndex, this.focusRowCriterea);
      // }

      if (fileItem.base === DOT_DOT) {
        this.changeDirNext(fileItem.dir);
      } else {
        this.changeDirNext(fileItem.dir + '/' + fileItem.base);
      }
    } else if (isZipBase(fileItem.base)) {
      // wir navigieren in ein zip-File hinein:
      const path = fileItem.dir + "/" + fileItem.base + ":";
      this.changeDirNext(path);

    } else if (isZipUrl(fileItem.dir)) {
      // wir navigieren in einem zip-File:
      const path = fileItem.dir + "/" + fileItem.base;
      this.changeDirNext(path);
    }
  }

  private changeDirNext(path: string) {
    console.info('changeDirNext', path);
    this.appService.changeDir(new ChangeDirEvent(this._panelIndex, path));
  }

  private isRelevantDir(f1: string, f2: string, zi: ZipUrlInfo): boolean {
    const sd = isSameDir(f1, f2);
    if (sd) return true;
    return isSameDir(f1, zi.zipUrl + ":");
  }

  private filterFn(value: FileItemIf, index: number, array: FileItemIf[]): boolean {
    if (value.base === DOT_DOT) return true;
    return (!this.filterActive || value.base.toLowerCase().includes(this.filterText.toLowerCase()))
      && (this.hiddenFilesVisible || !value.base.startsWith('.'))
      ;
  }

}

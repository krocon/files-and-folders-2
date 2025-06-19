import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  runInInjectionContext
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
  getParent,
  getZipUrlInfo,
  isRoot,
  isSameDir,
  isZipBase,
  isZipUrl,
  ZipUrlInfo,
} from "@fnf/fnf-data";
import {fileNameComparator} from "./comparator/name-comparator";
import {extComparator} from "./comparator/ext-comparator";
import {sizeComparator} from "./comparator/size-comparator";
import {dateComparator} from "./comparator/date-comparator";
import {PanelIndex} from "../../../../domain/panel-index";
import {AppService} from "../../../../app.service";
import {ChangeDirEvent} from "../../../../service/change-dir-event";
import {SelectionManagerForObjectModels} from "./selection-manager";
import {FileTableBodyModel} from "./file-table-body-model";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";
import {Subject} from "rxjs";
import {takeWhile} from "rxjs/operators";
import {GridSelectionCountService} from "../../../../service/grid-selection-count.service";
import {SelectionEvent} from "../../../../domain/filepagedata/data/selection-event";
import {SelectionLocalStorage} from "./selection-local-storage";
import {GotoAnythingDialogService} from "../../../cmd/gotoanything/goto-anything-dialog.service";
import {GotoAnythingDialogData} from "../../../cmd/gotoanything/goto-anything-dialog.data";
import {GotoAnythingOptionData} from "../../../cmd/gotoanything/goto-anything-option.data";
import {ActionId, actionIds} from "../../../../domain/action/fnf-action.enum";
import {FnfActionLabels} from "../../../../domain/action/fnf-action-labels";
import {NotifyService} from "../../../../service/cmd/notify-service";
import {NotifyEventIf} from "../../../../domain/cmd/notify-event.if";

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
export class FileTableComponent implements OnInit, OnDestroy {

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
      selectionKey: 'selected',
      isSelectable: (row: FileItemIf) => row.base !== DOT_DOT,
      getKey: (row: FileItemIf) => row.dir + '/' + row.base,
      equalRows: (a: FileItemIf, b: FileItemIf) => a.base === b.base && a.dir === b.dir,
    });
  private selectionLocalStorage: SelectionLocalStorage<FileItemIf> | undefined;
  private tableApi: TableApi | undefined;
  private alive = true;
  // private rowData: FileItemIf[] = [];
  private injector = inject(Injector);
  private filterText = "";
  private filterActive = false;
  private dirPara?: DirPara;
  private focusRowCriterea: Partial<FileItemIf> | null = null;


  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rwf: RenderWrapperFactory,
    private readonly appService: AppService,
    private readonly gridSelectionCountService: GridSelectionCountService,
    public readonly gotoAnythingDialogService: GotoAnythingDialogService,
    private readonly notifyService: NotifyService
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
    this.selectionLocalStorage = new SelectionLocalStorage<FileItemIf>(`panel${value}_`, this.selectionManager);
  }

  private _tabsPanelData?: TabsPanelData;

  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;

    const selectedTabData = this._tabsPanelData.tabs[this._tabsPanelData.selectedTabIndex];
    this.focusRowCriterea = selectedTabData.focusRowCriterea

    const filterChanged = this.filterText !== selectedTabData.filterText || this.filterActive !== selectedTabData.filterActive;
    this.filterText = selectedTabData.filterText ?? '';
    this.filterActive = selectedTabData.filterActive ?? false;

    if (!this.dirPara || this.dirPara?.path !== selectedTabData.path) {
      if (this.tableApi) {
        this.tableApi.setRows([]);
        this.repaintTable();
      }

      this.dirPara = new DirPara(selectedTabData.path, `file-panel-${this._panelIndex}`);
      this.requestRows();
    }

    if (filterChanged && this.tableApi) {
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();
      this.tableApi.repaintHard();
    }
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

    // Listen to changes in the entire dirEvents signal and log the results
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const selection = this.selectionManager.selection;
        const selectedRows = selection();
        this.calcButtonStates(selectedRows);
      });
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const dirEventsMap = this.appService.dirEvents();
        if (this.dirPara?.path) {
          let dirEvents = dirEventsMap.get(this.dirPara.path);
          if (dirEvents) this.handleDirEvent(dirEvents);
        }
      });
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
        (evt: NotifyEventIf) => {
          if (Array.isArray(evt.data)) {
            const arr = evt.data as Array<DirEventIf>;
            this.handleDirEvent(arr);
          }
        }
      )
  }


  private calcButtonStates<T>(selectedRows: FileItemIf[]) {
    if (this.dirPara?.path) {
      this.selectionLocalStorage?.persistSelection(this.dirPara?.path);
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


  ngOnDestroy(): void {
    this.alive = false;
  }

  onMouseClicked(evt: GeMouseEvent) {
    if (evt.clickCount === 2 && evt.areaIdent === 'body' && this.tableModel) {
      const fileItem: FileItemIf = this.bodyAreaModel.getRowByIndex(evt.rowIndex);
      this.changeDir(fileItem);

    } else if (evt.clickCount === 1 && evt.areaIdent === 'body' && this.tableModel) {
      if (this.tableApi) {
        this.setFocus2Index(evt.rowIndex);
        this.selectionManager.handleGeMouseEvent(evt);
      }
    }
    if (this.tableApi) {
      this.tableApi?.repaint();
    }
  }

  async requestRows(): Promise<void> {
    if (this.dirPara) {
      try {
        await this.appService.fetchDir(this.dirPara);
        // The effect in ngOnInit will handle the directory events
      } catch (e) {
        console.error(e);
      }
    }
  }

  test() {
    this.handleDirEvent(
      [
        {
          "dir": this.dirPara?.path ?? '',
          "items": [
            {
              "dir": this.dirPara?.path ?? '',
              "base": "README.md",
              "ext": ".md",
              "date": "2025-05-31T20:12:12.282Z",
              "error": "",
              "size": 1546,
              "isDir": false,
              "abs": false,
              "selected": true
            }
          ],
          "begin": false, "end": false, "size": 1, "error": "",
          "action": "unselect", "panelIndex": 0
        }
      ]
    )
  }

  handleDirEvent(dirEvents: DirEventIf[]): void {
    if (this.tableApi && dirEvents && this.dirPara) {
      for (let i = 0; i < dirEvents.length; i++) {
        const dirEvent = dirEvents[i];
        const zi: ZipUrlInfo = getZipUrlInfo(this.dirPara.path);

        if (this.isRelevantDir(dirEvent.dir, this.dirPara.path, zi)) {
          this.handleRelevantDirEvent(dirEvent, zi);
        }
      }
    }
  }

  testAdd() {
    this.handleDirEvent([
      {
        "dir": this.dirPara?.path ?? '',
        "items": [
          {
            "dir": this.dirPara?.path ?? '',
            "base": "NESTJS_TESTING_MIGRATION.md",
            "ext": ".md",
            "date": "",
            "error": "",
            "size": 1234,
            "isDir": false,
            "abs": false,
            "selected": false
          }
        ],
        "begin": false,
        "end": false,
        "size": 1,
        "error": "",
        "action": "add",
        "panelIndex": this.panelIndex
      }
    ]);
  }

  testUnlink() {
    this.handleDirEvent([
      {
        "dir": this.dirPara?.path ?? '',
        "items": [
          {
            "dir": this.dirPara?.path ?? '',
            "base": "package.json",
            "ext": ".json",
            "date": "",
            "error": "",
            "size": 0,
            "isDir": false,
            "abs": false,
            "selected": false
          }
        ],
        "begin": false,
        "end": false,
        "size": 1,
        "error": "",
        "action": "unlink",
        "panelIndex": this.panelIndex
      }
    ]);
  }

  testUnselect() {
    this.handleDirEvent([
      {
        "dir": this.dirPara?.path ?? '',
        "items": [
          {
            "dir": this.dirPara?.path ?? '',
            "base": "package.json",
            "ext": ".json",
            "date": "",
            "error": "",
            "size": 0,
            "isDir": false,
            "abs": false,
            "selected": false
          }
        ],
        "begin": false,
        "end": false,
        "size": 1,
        "error": "",
        "action": "unselect",
        "panelIndex": this.panelIndex
      }
    ]);
  }

  testSelect() {
    this.handleDirEvent([
      {
        "dir": this.dirPara?.path ?? '',
        "items": [
          {
            "dir": this.dirPara?.path ?? '',
            "base": "package.json",
            "ext": ".json",
            "date": "",
            "error": "",
            "size": 0,
            "isDir": false,
            "abs": false,
            "selected": true
          }
        ],
        "begin": false,
        "end": false,
        "size": 1,
        "error": "",
        "action": "select",
        "panelIndex": this.panelIndex
      }
    ]);
  }

  removeRows<T>(rows: FileItemIf[], predicate: (a: FileItemIf, b: FileItemIf) => boolean) {
    const am = this.bodyAreaModel
    let allRows1 = am.getAllRows();
    const allRows = allRows1.filter(r => !rows.some(rr => predicate(r, rr)));
    console.info(allRows1.length, allRows.length);
    am.setRows(allRows);

  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi
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

    } else if (action === 'ENHANCE_SELECTION') {
      // TODO ENHANCE_SELECTION

    } else if (action === 'REDUCE_SELECTION') {
      // TODO ENHANCE_SELECTION

    } else if (action === "SPACE_PRESSED") {
      const r = this.bodyAreaModel.focusedRowIndex;
      if (r > -1) {
        const row = this.bodyAreaModel.getRowByIndex(r);
        this.selectionManager.toggleRowSelection(row);
        this.tableApi?.repaint();
      }

    } else if (action === "ENTER_PRESSED") {
      const r = this.bodyAreaModel.focusedRowIndex;
      if (r > -1) {
        const row = this.bodyAreaModel.getRowByIndex(r);
        if (row?.isDir) {
          this.changeDir(row);
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
    }
  }

  setFocus2Index(index: number) {
    this.bodyAreaModel.focusedRowIndex = index;
    this.appService.resetFocusRowCriterea();
    this.tableApi?.repaint();

    const selection = this.selectionManager.selection;
    const selectedRows = selection();
    this.calcButtonStates(selectedRows);
  }

  private handleRelevantDirEvent(dirEvent: DirEventIf, zi: ZipUrlInfo) {
    if (!this.tableApi || !dirEvent || !this.dirPara) return;

    console.info('handleDirEvent (' + this.panelIndex + ')', dirEvent); // TODO del handleDirEvent

    if (dirEvent.action === "list") {
      let rows = dirEvent.items ?
        dirEvent.items.filter(fi => (
          fi.dir === this.dirPara?.path
          || isSameDir(fi.dir, this.dirPara?.path ?? '')
          || isRoot(fi.dir) && isRoot(zi.zipInnerUrl))
        ) :
        [];

      if (!isRoot(this.dirPara.path)) {
        rows = [
          new FileItem(getParent(this.dirPara.path), "..", "", "", "", 1, true),
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
      // console.info('handleDirEvent ' + this.panelIndex, dirEvents);
      if (dirEvent.end) {
        this.appService.resetFocusRowCriterea();
      }

    } else if (dirEvent.action === "add" || dirEvent.action === "addDir") {
      this.tableApi.addRows(dirEvent.items)
      // this.checkAndAddItems(dirEvent.items);
      this.repaintTable();
      console.info(this.bodyAreaModel.getAllRows());

    } else if (dirEvent.action === "unlink" || dirEvent.action === "unlinkDir") {
      console.info('this.tableApi.removeRows')
      this.tableApi.removeRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir);
      this.repaintTable();
      //this.checkAndRemoveItems(dirEvent.items);

    } else if (dirEvent.action === "unselect") {
      this.tableApi.findRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir)
        .forEach(r => {
          r.selected = false;
          this.selectionManager.setRowSelected(r, false);
        });
      this.selectionManager.updateSelection();
      this.repaintTable();

    } else if (dirEvent.action === "select") {
      this.tableApi.findRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir)
        .forEach(r => {
          r.selected = true;
          this.selectionManager.setRowSelected(r, true);
        });
      this.selectionManager.updateSelection();
      this.repaintTable();

    } else if (dirEvent.action === "change") {
      this.tableApi.updateRows(dirEvent.items, (a, b) => a.base === b.base && a.dir === b.dir);
      this.repaintTable();
      //console.info('TODO handleDirEvent "change"', dirEvent);
      //this.reload();

    } else {
      console.warn("Unknown dir changedir action:", dirEvent);
    }
  }

  private getRowByCriteria(criteria: FileItemIf): FileItemIf | undefined {
    const rowData = this.bodyAreaModel.getFilteredRows();
    return rowData.find(row => row.base === criteria.base && row.dir === criteria.dir);
  }

  private setRows(fileItems: FileItemIf[]): void {
    if (this.tableApi) {
      this.tableApi.setRows(fileItems);
      if (this.dirPara?.path) {
        this.selectionLocalStorage?.apply(this.dirPara?.path);
      }
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();

      if (this.focusRowCriterea) {
        const rows = this.bodyAreaModel.getFilteredRows();
        const rowIndex = rows.findIndex(
          row =>
            Object.entries(this.focusRowCriterea!)
              .every(([key, value]) => row[key as keyof FileItemIf] === value)
        );
        this.setFocus2Index(rowIndex ?? 0);
      }
      if (this.bodyAreaModel.focusedRowIndex >= this.bodyAreaModel.getRowCount()) {
        this.setFocus2Index(Math.max(0, this.bodyAreaModel.getRowCount() - 1));
      }
      this.tableApi.repaintHard();
    }
  }

  private checkAndAddItems(items: FileItemIf[]) {
    const rows: FileItemIf[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (this.getIndexInRowData(item) === -1) {
        rows.push(item);
      }
    }
    this.setRows(rows);
  }

  private checkAndRemoveItems(items: FileItemIf[]) {
    const rows: FileItemIf[] = this.bodyAreaModel.getAllRows();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const idx = this.getIndexInRowData(item);
      if (idx > -1) {
        rows.splice(idx, 1);
      }
    }
    this.setRows(rows);
  }

  private getIndexInRowData(item: FileItemIf): number {
    const rows = this.bodyAreaModel.getFilteredRows();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.dir === item.dir && row.base === item.base) {
        return i;
      }
    }
    return -1;
  }

  private repaintTable() {
    if (this.tableApi) {
      this.tableApi.externalFilterChanged();
      this.tableApi.reSort();
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
    this.appService.changeDir(new ChangeDirEvent(this._panelIndex, path));
  }

  private isRelevantDir(f1: string, f2: string, zi: ZipUrlInfo): boolean {
    const sd = isSameDir(f1, f2);
    console.info('isRelevantDir ' + f1 + ', ' + f2, sd);
    if (sd) return true;
    return isSameDir(f1, zi.zipUrl + ":");
  }

  private filterFn(value: FileItemIf, index: number, array: FileItemIf[]): boolean {
    return !this.filterActive
      || value.base === DOT_DOT
      || value.base.toLowerCase().includes(this.filterText.toLowerCase());
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChangeDirDialogData} from "./data/change-dir-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FileItemIf, FindFolderPara} from "@fnf/fnf-data";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
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
import {ChangeDirTargetCellRendererComponent} from "./change-dir-target-cell-renderer.component";
import {GotoAnythingDialogService} from "../gotoanything/goto-anything-dialog.service";
import {createAsciiTree, filterAsciiTree} from "../../../common/fn/ascii-tree.fn";
import {takeWhile} from "rxjs/operators";
import {ChangeDirEvent} from "../../../service/change-dir-event";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";


@Component({
  selector: "fnf-change-dir-dialog",
  templateUrl: "./change-dir-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatButton,
    MatDialogActions,
    TableComponent,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatSlider,
    MatSliderThumb,
  ],
  styleUrls: ["./change-dir-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDirDialogComponent implements OnInit, OnDestroy {

  maxDeep = 20

  filterText = '';
  deep: number = this.maxDeep;

  tableModel?: TableModelIf;
  rows: { path: string, label: string }[] = [];
  filteredRows: { path: string, label: string }[] = [];

  private readonly rowHeight = 20;
  readonly tableOptions: TableOptionsIf = {
    ...new TableOptions(),
    hoverColumnVisible: false,
    defaultRowHeights: {
      header: 0,
      body: this.rowHeight,
      footer: 0
    },
    horizontalBorderVisible: false,
    verticalBorderVisible: false,
    autoRestoreOptions: {
      ...new AutoRestoreOptions<FileItemIf>(),
      getStorageKeyFn: () => `fnf-multirename-table`,
      autoRestoreCollapsedExpandedState: true,
      autoRestoreScrollPosition: true,
      autoRestoreSortingState: true,
      autoRestoreSelectedState: false
    },
    // externalFilterFunction: this.filterFn.bind(this),
    getSelectionModel: () => undefined,
    getFocusModel: () => undefined,
    shortcutActionsDisabled: true,
  };
  private tableApi: TableApi | undefined;
  private alive = true;

  private filterTextChanged = new Subject<string>();

  private readonly INDENTATION_SPACE = ' ';
  private readonly INDENTATION_MULTIPLIER = 3;

  constructor(
    public dialogRef: MatDialogRef<ChangeDirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public changeDirDialogData: ChangeDirDialogData,
    private readonly rwf: RenderWrapperFactory,
    private readonly cdr: ChangeDetectorRef,
    private readonly gotoAnythingDialogService: GotoAnythingDialogService,
  ) {

    const columnDefs = [
      ColumnDef.create({
        property: "label",
        headerLabel: "",
        width: new Size(100, 'weight'),
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(ChangeDirTargetCellRendererComponent, this.cdr),
        sortable: () => false,
        sortIconVisible: () => false,
      }),
    ];

    this.tableModel = TableFactory.createTableModel({
      rows: [],
      columnDefs,
      tableOptions: this.tableOptions,
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
    this.initFetchDirectories(1);
    this.initFetchDirectories(5);
    this.initFetchDirectories(this.maxDeep);
    this.initTextChangeListener();
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi;
  }

  onMouseClicked(evt: GeMouseEvent) {
    if (this.tableApi) {
      const row = this.tableApi.getBodyModel().getRowByIndex(evt.rowIndex);
      if (row) {
        const path = (row.path ?? '');
        this.dialogRef.close(
          new ChangeDirEvent(this.changeDirDialogData.sourcePanelIndex, path)
        );
      }
    }
  }

  onFilterChangedByUser(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterTextChanged.next(input.value);
  }

  applyFilter() {
    const fr = filterAsciiTree(
      this.rows.filter(r => r.path.split('/').length <= this.deep),
      this.filterPredicate.bind(this)
    );
    this.filteredRows = [
      ...createAsciiTree(
        fr.map(s => s.path)
      )
    ];


    this.tableApi?.setRows(this.filteredRows);
    this.tableApi?.repaintHard();
  }

  private getIndentation(path: string): string {
    const depth = path.split('/').length;
    const indentationLength = depth * this.INDENTATION_MULTIPLIER;
    return this.INDENTATION_SPACE.repeat(indentationLength);
  }


  private initFetchDirectories(deep: number = 5) {
    const para = new FindFolderPara([this.changeDirDialogData.sourceDir], '', deep);
    this.gotoAnythingDialogService
      .findFolders(para)
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(arr => {
        this.rows = createAsciiTree(arr);
          this.applyFilter();
        // this.tableApi?.setRows(this.rows);
        // this.tableApi?.repaintHard();
        }
      );
  }

  private initTextChangeListener() {
    this.filterTextChanged
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filterText => {
        this.applyFilter()
      });
  }

  private filterPredicate(r: { path: string, label: string }): boolean {
    if (!this.filterText) return true;

    const fs = this.filterText.toLowerCase().split(' ');

    const negs = fs?.filter(f => f.startsWith('-'))
      .map(f => f.substring(1).trim())
      .filter(f => f);

    const poss = fs?.filter(f => !f.startsWith('-'))
      .map(f => f.replace(/^\+/g, '').trim())
      .filter(f => f);

    return poss.every(f => {
        if (f.includes('|')) {
          const ors = f.split('|');
          return ors.some(or => r.path.toLowerCase().includes(or));
        }
        return r.path.toLowerCase().includes(f)
      })
      &&
      negs.every(f => {
        if (f.includes('|')) {
          const ors = f.split('|');
          return !ors.some(or => r.path.toLowerCase().includes(or));
        }
        return !r.path.toLowerCase().includes(f);
      });
  }

}

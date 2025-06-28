import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
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
import {createAsciiTree} from "../../../common/fn/ascii-tree.fn";
import {takeWhile} from "rxjs/operators";
import {ChangeDirEvent} from "../../../service/change-dir-event";


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
  ],
  styleUrls: ["./change-dir-dialog.component.css"]
})
export class ChangeDirDialogComponent implements OnInit, OnDestroy {


  tableModel?: TableModelIf;
  rows: {path:string, label:string}[] = [];

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

  async ngOnInit(): Promise<void> {
    this.alive = true;
    const para = new FindFolderPara([this.changeDirDialogData.sourceDir], '', 20);
    this.gotoAnythingDialogService
      .findFolders(para)
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(
        arr => {
          this.rows =
            createAsciiTree(
              arr.map(s => s.substring(this.changeDirDialogData.sourceDir.length))
            );
          // this.rows=filterAsciiTree(this.rows, (row=> row.label.includes('Resolve')))
          this.tableApi?.setRows(this.rows);
          this.tableApi?.repaintHard();
        }
      );
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
        let path = this.changeDirDialogData.sourceDir + (row.path??'');
        this.dialogRef.close(
          new ChangeDirEvent(this.changeDirDialogData.sourcePanelIndex, path)
        );
      }
    }
  }

}

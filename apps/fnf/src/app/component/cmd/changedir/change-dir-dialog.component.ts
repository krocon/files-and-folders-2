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
  Size,
  TableApi,
  TableFactory,
  TableModelIf,
  TableOptions,
  TableOptionsIf
} from "@guiexpert/table";
import {ChangeDirTargetCellRendererComponent} from "./change-dir-target-cell-renderer.component";
import {GotoAnythingDialogService} from "../gotoanything/goto-anything-dialog.service";

export interface CdRowIf {
  dir: string;
}


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
  rows: CdRowIf[] = [];

  private readonly rowHeight = 34;
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
    // console.info("changeDirDialogData:", changeDirDialogData);

    const columnDefs = [
      ColumnDef.create({
        property: "dir",
        headerLabel: "",
        width: new Size(100, 'weight'),
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(ChangeDirTargetCellRendererComponent, this.cdr),
        sortable: () => true,
        sortIconVisible: () => true,
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
      .subscribe(
        arr => {
          this.rows = arr.map(s => {
            return {dir: s};
          });
          this.tableApi?.setRows(this.rows);
          this.tableApi?.repaintHard();
          console.info("this.rows:", this.rows);
        }
      );
  }

  onOkClicked() {
    // TODO onOkClicked
    // this.dialogRef.close();
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi;
    console.info("this.tableApi:", this.tableApi);
  }

  private updateTableRows() {
    // const dialogData = this.clone<ChangeDirDialogData>(this.changeDirDialogData);
    // dialogData.data = this.formGroup.getRawValue();
    // const updateModel: ChangeDirResult = this.changeDirService.getUpdateModel(dialogData);
    // this.rows = this.changeDirService.getFileOperationParams(
    //   updateModel.rows,
    //   dialogData.sourcePanelIndex,
    //   dialogData.targetPanelIndex
    // );
  }

  private clone<T>(r: T): T {
    return JSON.parse(JSON.stringify(r));
  }
}

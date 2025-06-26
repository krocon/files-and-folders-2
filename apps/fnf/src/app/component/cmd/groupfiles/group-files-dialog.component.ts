import {ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GroupFilesDialogData} from "./data/group-files-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FileItemIf} from "@fnf/fnf-data";

import {takeWhile} from "rxjs/operators";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {GroupFilesData} from "./data/group-files.data";
import {GroupFilesOptions} from "./data/group-files-options";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
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

import {FileOperationParams} from "../../../domain/cmd/file-operation-params";
import {CommandService} from "../../../service/cmd/command.service";
import {GroupFilesNameCellRendererComponent} from "./group-files-name-cell-renderer.component";
import {GroupFilesService} from "./group-files.service";
import {debounceTime} from "rxjs";
import {GroupFilesResult} from "./data/group-files-result";
import {GroupFilesTargetCellRendererComponent} from "./group-files-target-cell-renderer.component";

@Component({
  selector: "fnf-group-files-dialog",
  templateUrl: "./group-files-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatButton,
    MatDialogActions,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatCheckbox,
    TableComponent,
  ],
  styleUrls: ["./group-files-dialog.component.css"]
})
export class GroupFilesDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  source = "";
  data: GroupFilesData;
  options: GroupFilesOptions;
  groupCount: number = 0;

  tableModel?: TableModelIf;
  rows: FileOperationParams[];

  private readonly rowHeight = 34;
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
    public dialogRef: MatDialogRef<GroupFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public groupFilesDialogData: GroupFilesDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly rwf: RenderWrapperFactory,
    private readonly cdr: ChangeDetectorRef,
    private readonly groupFilesService: GroupFilesService,
    private readonly zone: NgZone,
  ) {
    this.data = groupFilesDialogData.data;
    this.options = groupFilesDialogData.options;

    this.formGroup = this.formBuilder.group(
      {
        modus: new FormControl(this.data.modus, [Validators.required]),
        ignoreBrackets: new FormControl(this.data.ignoreBrackets, []),
        useSourceDir: new FormControl(this.data.useSourceDir, []),

        newFolder: new FormControl(this.data.newFolder, []),
        minsize: new FormControl(this.data.minsize, []),
      }
    );


    this.rows = groupFilesDialogData.rows.map(
      r => new FileOperationParams(
        r,
        0,
        this.clone<FileItemIf>(r),
        0,
        groupFilesDialogData.rows.length > CommandService.BULK_LOWER_LIMIT)
    );
    console.info('this.rows', this.rows);
    const columnDefs = [
      ColumnDef.create({
        property: "source",
        headerLabel: "Source",
        width: new Size(50, 'weight'),
        minWidth: new Size(200, 'px'),
        bodyRenderer: this.rwf.create(GroupFilesNameCellRendererComponent, this.cdr),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        sortable: () => true,
        sortIconVisible: () => true,
      }),
      // ColumnDef.create({
      //   property: "target",
      //   headerLabel: " ",
      //   width: new Size(30, 'px'),
      //   minWidth: new Size(30, 'px'),
      //   headerClasses: ["ge-table-text-align-left"],
      //   bodyClasses: ["ge-table-text-align-left"],
      //   bodyRenderer: this.rwf.create(ChangeCellRendererComponent, this.cdr),
      //   sortable: () => true,
      //   sortIconVisible: () => true,
      // }),
      ColumnDef.create({
        property: "target",
        headerLabel: "Target",
        width: new Size(50, 'weight'),
        minWidth: new Size(200, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(GroupFilesTargetCellRendererComponent, this.cdr),
        sortable: () => true,
        sortIconVisible: () => true,
      }),
    ];

    this.updateTableRows();

    this.tableModel = TableFactory.createTableModel({
      rows: this.rows,
      columnDefs,
      tableOptions: this.tableOptions,
    });
  }


  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
    this.formGroup.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(300),
      )
      .subscribe(evt => {
        this.updateTableRows();
        this.tableApi?.setRows(this.rows);
        this.tableApi?.repaint();
      });
  }

  onOkClicked() {
    // TODO const actionEvents = this.multiRenameService.createActionEvents(this.rows, this.groupFilesDialogData.panelIndex);
    // this.dialogRef.close(actionEvents);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi
  }

  private updateTableRows() {
    const dialogData = this.clone<GroupFilesDialogData>(this.groupFilesDialogData);
    dialogData.data = this.formGroup.getRawValue();
    const updateModel: GroupFilesResult = this.groupFilesService.getUpdateModel(dialogData);
    this.rows = this.groupFilesService.getFileOperationParams(
      updateModel.rows,
      dialogData.sourcePanelIndex,
      dialogData.targetPanelIndex
    );
    this.groupCount = updateModel.groupCount;
    console.info('this.rows', this.rows);
  }

  private clone<T>(r: T): T {
    return JSON.parse(JSON.stringify(r));
  }
}

import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultiRenameDialogData} from "./data/multi-rename-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FileItemIf} from "@fnf/fnf-data";

import {takeWhile} from "rxjs/operators";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MultiRenameData} from "./data/multi-rename.data";
import {MultiRenameOptions} from "./data/multi-rename-options";
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
import {NameCellRendererComponent} from "../../main/filetable/renderer/name-cell-renderer.component";
import {fileNameComparator} from "../../main/filetable/comparator/name-comparator";
import {extComparator} from "../../main/filetable/comparator/ext-comparator";
import {SizeCellRendererComponent} from "../../main/filetable/renderer/size-cell-renderer.component";
import {sizeComparator} from "../../main/filetable/comparator/size-comparator";
import {DateCellRendererComponent} from "../../main/filetable/renderer/date-cell-renderer.component";
import {dateComparator} from "../../main/filetable/comparator/date-comparator";
import {FileOperationParams} from "../../../domain/cmd/file-operation-params";
import {CommandService} from "../../../service/cmd/command.service";
import {ChangeCellRendererComponent} from "./change-cell-renderer.component";
import {MultiRenameNameCellRendererComponent} from "./multi-rename-name-cell-renderer.component";

@Component({
  selector: "fnf-multi-rename-dialog",
  templateUrl: "./multi-rename-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatCheckbox,
    TableComponent,
    NameCellRendererComponent
  ],
  styleUrls: ["./multi-rename-dialog.component.css"]
})
export class MultiRenameDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  source = "";
  data: MultiRenameData;
  options: MultiRenameOptions;

  tableModel?: TableModelIf;

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
    public dialogRef: MatDialogRef<MultiRenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public multiRenameDialogData: MultiRenameDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly rwf: RenderWrapperFactory,
    private readonly cdr: ChangeDetectorRef,
  ) {
    console.info(multiRenameDialogData);
    this.data = multiRenameDialogData.data;
    this.options = multiRenameDialogData.options;

    this.formGroup = this.formBuilder.group(
      {
        name: new FormControl(this.data.name, [Validators.required, Validators.minLength(1)]),
        capitalizeMode: new FormControl(this.data.capitalizeMode, []),
        counterStart: new FormControl(this.data.counterStart, []),
        counterStep: new FormControl(this.data.counterStep, []),
        counterDigits: new FormControl(this.data.counterDigits, []),

        replaceGermanUmlauts: new FormControl(this.data.replaceGermanUmlauts, []),
        replaceRiskyChars: new FormControl(this.data.replaceRiskyChars, []),
        replaceSpaceToUnderscore: new FormControl(this.data.replaceSpaceToUnderscore, []),
        replaceParentDir: new FormControl(this.data.replaceParentDir, []),

        replacementsChecked: new FormControl(this.data.replacementsChecked, []),
        replacements: formBuilder.array(
          this.data.replacements.map(r => this.formBuilder.group(
            {
              checked: new FormControl(r.checked, []),
              textFrom: new FormControl(r.textFrom, []),
              textTo: new FormControl(r.textTo, []),
              regExpr: new FormControl(r.regExpr, []),
              ifFlag: new FormControl(r.ifFlag, []),
              ifMatch: new FormControl(r.ifMatch, [])
            })
          )
        )
      }
    );

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(() => {
    //     //
    //   });

    const rows: FileOperationParams[] = multiRenameDialogData.rows.map(
      r => new FileOperationParams(
        r,
        0,
        this.clone(r),
        0,
        multiRenameDialogData.rows.length > CommandService.BULK_LOWER_LIMIT)
    );
    const columnDefs = [
      ColumnDef.create({
        property: "source",
        headerLabel: "Old Name",
        width: new Size(50, 'weight'),
        minWidth: new Size(200, 'px'),
        bodyRenderer: this.rwf.create(MultiRenameNameCellRendererComponent, this.cdr),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        // sortComparator: fileNameComparator,
        sortable: () => true,
        sortIconVisible: () => true,
      }),
      ColumnDef.create({
        property: "target",
        headerLabel: " ",
        width: new Size(30, 'px'),
        minWidth: new Size(30, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(ChangeCellRendererComponent, this.cdr),
        sortable: () => true,
        sortIconVisible: () => true,
      }),
      ColumnDef.create({
        property: "target",
        headerLabel: "New Name",
        width: new Size(50, 'weight'),
        minWidth: new Size(200, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(MultiRenameNameCellRendererComponent, this.cdr),
        // sortComparator: fileNameComparator,
        sortable: () => true,
        sortIconVisible: () => true,
      }),
    ];
    this.tableModel = TableFactory.createTableModel({
      rows,
      columnDefs,
      tableOptions: this.tableOptions,
    });
  }

  get replacements(): FormArray {
    return this.formGroup.get('replacements') as FormArray;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
  }

  onOkClicked() {
    // const fileItem = new FileItem(this.data.target, this.formGroup.getRawValue().name, "");
    // fileItem.isDir = true;
    // this.dialogRef.close(fileItem);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi
  }

  private clone(r: FileItemIf): FileItemIf {
    return JSON.parse(JSON.stringify(r));
  }
}

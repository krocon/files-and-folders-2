import {ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultiMkdirDialogData} from "./data/multi-mkdir-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

import {takeWhile} from "rxjs/operators";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MultiMkdirData} from "./data/multi-mkdir.data";
import {MultiMkdirOptions} from "./data/multi-mkdir-options";
import {MatOption, MatSelect} from "@angular/material/select";
import {debounceTime} from "rxjs";
import {MultiMkdirService} from "./multi-mkdir.service";
import {TypedDataService} from "../../../common/typed-data.service";
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
import {FileItemIf} from "@fnf/fnf-data";

@Component({
  selector: "fnf-multi-mkdir-dialog",
  templateUrl: "./multi-mkdir-dialog.component.html",
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
    TableComponent
  ],
  styleUrls: ["./multi-mkdir-dialog.component.css"]
})
export class MultiMkdirDialogComponent implements OnInit, OnDestroy {

  private static readonly innerServiceMultiMkdirData = new TypedDataService<MultiMkdirData>("multiMkdirData", new MultiMkdirData());

  parentDir: string;

  formGroup: FormGroup;
  data: MultiMkdirData;
  options: MultiMkdirOptions;
  directoryNames: string[] = [];

  private readonly rowHeight = 34;
  tableModel: TableModelIf;
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
      getStorageKeyFn: () => `fnf-multimkdir-table`,
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
    public dialogRef: MatDialogRef<MultiMkdirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public multiMkdirDialogData: MultiMkdirDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly multiMkdirService: MultiMkdirService,
    private readonly rwf: RenderWrapperFactory,
    private readonly zone: NgZone
  ) {
    this.data = multiMkdirDialogData.data ? multiMkdirDialogData.data : MultiMkdirDialogComponent.innerServiceMultiMkdirData.getValue();
    this.options = multiMkdirDialogData.options as MultiMkdirOptions;
    this.parentDir = multiMkdirDialogData.parentDir ?? '';
    this.formGroup = this.formBuilder.group(
      {
        folderNameTemplate: new FormControl(this.data.folderNameTemplate, [Validators.required, Validators.minLength(1)]),
        letterCase: new FormControl(this.data.letterCase, []),
        counterStart: new FormControl(this.data.counterStart, []),
        counterStep: new FormControl(this.data.counterStep, []),
        counterEnd: new FormControl(this.data.counterEnd, []),
        counterDigits: new FormControl(this.data.counterDigits, [])
      }
    );

    const columnDefs = [
      ColumnDef.create({
        property: "directoryName",
        headerLabel: "New Directory Names",
        width: new Size(100, 'weight'),
        minWidth: new Size(200, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
      })
    ];

    this.tableModel = TableFactory.createTableModel({
      rows: this.directoryNames.map(name => ({directoryName: this.parentDir + '/' + name})),
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
      .subscribe(formValue => {
        this.updateDirectoryNames(formValue);
      });

    // Initial update
    this.updateDirectoryNames(this.formGroup.value);
  }

  onCreateAllClicked() {
    if (this.multiMkdirDialogData.data === null) {
      MultiMkdirDialogComponent.innerServiceMultiMkdirData.update(
        {...new MultiMkdirData(), ...this.formGroup.getRawValue()}
      );
    }
    this.dialogRef.close(this.directoryNames);
  }

  onResetClicked() {
    this.data = new MultiMkdirData();
    MultiMkdirDialogComponent.innerServiceMultiMkdirData.update(this.data);
    this.formGroup.reset(this.data);
    this.updateDirectoryNames(this.data);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi;
    this.updateTable();
  }

  private updateDirectoryNames(formValue: any) {
    const data = {...new MultiMkdirData(), ...formValue};
    this.directoryNames = this.multiMkdirService.generateDirectoryNames(data, this.parentDir);
    this.updateTable();

    this.cdr.detectChanges();
  }

  private updateTable() {
    if (this.tableApi && this.directoryNames?.length) {
      const rows = this.directoryNames.map(name => ({directoryName: this.parentDir + '/' + name}));
      this.tableApi.setRows(rows);
      this.tableApi.repaint();
    }
  }
}

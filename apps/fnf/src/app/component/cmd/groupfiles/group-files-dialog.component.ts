import {AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GroupFilesDialogData} from "./data/group-files-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ConvertResponseType, FileItemIf} from "@fnf/fnf-data";

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
  AvoidDoubleExecution,
  ColumnDef,
  Size,
  TableApi,
  TableFactory,
  TableModelIf,
  TableOptions,
  TableOptionsIf
} from "@guiexpert/table";

import {QueueFileOperationParams} from "../../../domain/cmd/queue-file-operation-params";
import {CommandService} from "../../../service/cmd/command.service";
import {GroupFilesNameCellRendererComponent} from "./renderer/group-files-name-cell-renderer.component";
import {GroupFilesService} from "./group-files.service";
import {debounceTime} from "rxjs";
import {GroupFilesResult} from "./data/group-files-result";
import {GroupFilesTargetCellRendererComponent} from "./renderer/group-files-target-cell-renderer.component";
import {fileItemComparator} from "../../../common/comparator/file-item-comparator";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FnfConfirmationDialogService} from "../../../common/confirmationdialog/fnf-confirmation-dialog.service";
import {TypedDataService} from "../../../common/typed-data.service";
import {AiCompletionService} from "../../../service/ai/ai-completion.service";
import {GroupfilesChangeCellRendererComponent} from "./renderer/groupfiles-change-cell-renderer.component";

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
    MatButtonToggle,
    MatButtonToggleGroup,
    MatProgressSpinner,
  ],
  styleUrls: ["./group-files-dialog.component.css"]
})
export class GroupFilesDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  private static readonly innerService = new TypedDataService<GroupFilesData>("groupFilesData", new GroupFilesData());


  formGroup: FormGroup;
  source = "";
  data: GroupFilesData;
  options: GroupFilesOptions;
  groupCount: number = 0;

  tableModel?: TableModelIf;
  rows: QueueFileOperationParams[];
  public hasOpenAiApiKey: boolean = false;
  fetchAiButtonDisabled = false;
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
  private convertResponse: ConvertResponseType | undefined;

  constructor(
    public dialogRef: MatDialogRef<GroupFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public groupFilesDialogData: GroupFilesDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly rwf: RenderWrapperFactory,
    private readonly cdr: ChangeDetectorRef,
    private readonly groupFilesService: GroupFilesService,
    private readonly zone: NgZone,
    private readonly confirmationDialogService: FnfConfirmationDialogService,
    private readonly aiCompletionService: AiCompletionService,
  ) {
    this.data = groupFilesDialogData.data;
    this.options = groupFilesDialogData.options;

    this.data = groupFilesDialogData.data ? groupFilesDialogData.data : GroupFilesDialogComponent.innerService.getValue();
    if (!this.data.strategy) this.data.strategy = 'Manual';

    this.formGroup = this.formBuilder.group(
      {
        strategy: new FormControl('x', []),
        // targetDir: new FormControl(groupFilesDialogData.targetDirs[0], []),

        modus: new FormControl(this.data.modus, [Validators.required]),
        ignoreBrackets: new FormControl(this.data.ignoreBrackets, []),
        useSourceDir: new FormControl(this.data.useSourceDir, []),

        newFolder: new FormControl(this.data.newFolder, []),
        minsize: new FormControl(this.data.minsize, []),
      }
    );


    this.rows = groupFilesDialogData.rows.map(
      r => new QueueFileOperationParams(
        r,
        0,
        this.clone<FileItemIf>(r),
        0,
        groupFilesDialogData.rows.length > CommandService.BULK_LOWER_LIMIT)
    );

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
        sortComparator: fileItemComparator,
      }),
      ColumnDef.create({
        property: "target",
        headerLabel: " ",
        width: new Size(30, 'px'),
        minWidth: new Size(30, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(GroupfilesChangeCellRendererComponent, this.cdr),
        sortable: () => true,
        sortIconVisible: () => true,
      }),
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
        sortComparator: fileItemComparator,
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

    this.aiCompletionService
      .hasOpenAiApiKey()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(res => {
        this.hasOpenAiApiKey = res;
      });

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

  ngAfterViewInit(): void {
    // hack: we want to see a change in toggle buttons (After that we will see the check mark icon on the button)
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.formGroup.patchValue({strategy: this.data.strategy}, {emitEvent: true, onlySelf: false});
        })
      }, 0);
    });
  }

  @AvoidDoubleExecution()
  onFetchAiClicked() {
    this.fetchAiButtonDisabled = true;
    this.initTargets();
    this.cdr.detectChanges();

    this.aiCompletionService
      .groupfiles({
        files: this.rows.map(this.aiCompletionService.fileOperationParams2Url),
      })
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(res => {
        this.convertResponse = res;
        this.fetchAiButtonDisabled = false;
        this.cdr.detectChanges();
        this.handleConvertResponse();
      });
  }

  openInfo() {
    this.confirmationDialogService.showInfo([
      "To run the AI mode, you'll need an OpenAI account and associated API key (https://platform.openai.com/signup). ",
      "Set an environment variable called `FNF_OPENAI_API_KEY` with your API key.",
      "Alternatively you can create an `.env` file at the root of this app containing `FNF_OPENAI_API_KEY=<your API key>`, which will be picked up by nestjs."
    ]);
  }

  onOkClicked() {
    const formRawValue = this.formGroup.getRawValue();
    this.groupFilesDialogData.data = formRawValue;

    if (this.groupFilesDialogData.data.strategy === 'AI') {
      const actionEvents = this.groupFilesService.createActionEventsForAi(
        this.rows,
        this.groupFilesDialogData,
      );
      this.dialogRef.close(actionEvents);

    } else {
      const actionEvents = this.groupFilesService.createActionEvents(
        this.rows,
        this.groupFilesDialogData,
      );
      this.dialogRef.close(actionEvents);
    }

  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi
  }

  private handleConvertResponse() {
    const cr = this.convertResponse;

    if (cr) {
      let rawValue = this.formGroup.getRawValue();
      const targetDir = (rawValue.useSourceDir) ? this.groupFilesDialogData.sourceDir : this.groupFilesDialogData.targetDir;

      this.rows.forEach((r, i) => {
        const url = this.aiCompletionService.fileOperationParams2Url(r);

        if (cr[url] === url) {
          r.target.dir = '';
          r.target.base = '';

        } else if (cr[url]) {
          r.target.dir = targetDir;
          r.target.base = (targetDir.endsWith('/') && cr[url].startsWith('/')) ? cr[url].substring(1) : cr[url];
        }
      });
      this.tableApi?.setRows(this.rows);
      this.tableApi?.repaint();
    }
    this.cdr.detectChanges();
  }

  private updateTableRows() {
    this.initTargets();
    const rawValue = this.formGroup.getRawValue();

    if (rawValue.strategy === 'AI') {
      this.handleConvertResponse();

    } else {

      const dialogData = this.clone<GroupFilesDialogData>(this.groupFilesDialogData);
      dialogData.data = rawValue;
      if (dialogData.data.strategy !== 'AI') {
        const updateModel: GroupFilesResult = this.groupFilesService.getUpdateModel(dialogData);
        this.rows = this.groupFilesService.getFileOperationParams(
          updateModel.rows,
          dialogData.sourcePanelIndex,
          dialogData.targetPanelIndex
        );
        this.groupCount = updateModel.groupCount;
      }
    }
  }

  private clone<T>(r: T): T {
    return JSON.parse(JSON.stringify(r));
  }

  private initTargets() {
    this.rows.map(r => {
      r.target.dir = '';
      r.target.base = '';
      r.target.ext = '';
      return r;
    });
  }

}

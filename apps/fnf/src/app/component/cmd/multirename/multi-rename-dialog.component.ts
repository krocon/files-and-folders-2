import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
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
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MultiRenameData} from "./data/multi-rename.data";
import {MultiRenameOptions} from "./data/multi-rename-options";
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
import {ChangeCellRendererComponent} from "../../../common/renderer/change-cell-renderer.component";
import {FileItemNameCellRendererComponent} from "../../../common/renderer/file-item-name-cell-renderer.component";
import {MultiRenameService} from "./multi-rename.service";
import {debounceTime} from "rxjs";
import {fileItemComparator} from "../../../common/comparator/file-item-comparator";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {Makro} from "./data/makro";
import {MatDivider} from "@angular/material/divider";
import {TypedDataService} from "../../../common/typed-data.service";
import {AiCompletionService} from "../../../service/ai/ai-completion.service";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FnfConfirmationDialogService} from "../../../common/confirmationdialog/fnf-confirmation-dialog.service";

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
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatSuffix,
    MatDivider,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatProgressSpinner,
  ],
  styleUrls: ["./multi-rename-dialog.component.css"]
})
export class MultiRenameDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  private static readonly innerServiceMultiRenameData = new TypedDataService<MultiRenameData>("multiRenameData", new MultiRenameData());

  @ViewChild(MatButtonToggleGroup) buttonToggleGroup?: MatButtonToggleGroup;
  @ViewChildren(MatButtonToggle) buttonToggles?: QueryList<MatButtonToggle>;

  formGroup: FormGroup;
  source = "";
  data: MultiRenameData;
  options: MultiRenameOptions;
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
    private readonly multiRenameService: MultiRenameService,
    private readonly zone: NgZone,
    private readonly aiCompletionService: AiCompletionService,
    private readonly confirmationDialogService: FnfConfirmationDialogService,
  ) {
    this.data = multiRenameDialogData.data ? multiRenameDialogData.data : MultiRenameDialogComponent.innerServiceMultiRenameData.getValue();
    if (!this.data.strategy) this.data.strategy = 'Manual';
    this.options = multiRenameDialogData.options;

    this.formGroup = this.formBuilder.group(
      {
        strategy: new FormControl('x', []),
        renameTemplate: new FormControl(this.data.renameTemplate, [Validators.required, Validators.minLength(1)]),
        capitalizeMode: new FormControl(this.data.capitalizeMode, []),
        counterStart: new FormControl(this.data.counterStart, []),
        counterStep: new FormControl(this.data.counterStep, []),
        counterDigits: new FormControl(this.data.counterDigits, []),

        ignoreExtension: new FormControl(this.data.ignoreExtension, []),
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


    this.rows = multiRenameDialogData.rows.map(
      r => new QueueFileOperationParams(
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
        bodyRenderer: this.rwf.create(FileItemNameCellRendererComponent, this.cdr),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        sortComparator: fileItemComparator,
        sortable: () => true,
        sortIconVisible: () => true,
      }),
      ColumnDef.create({
        property: "targetPanelIndex", /* a dummy prop */
        headerLabel: " ",
        width: new Size(30, 'px'),
        minWidth: new Size(30, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(ChangeCellRendererComponent, this.cdr),
        sortable: () => false,
        sortIconVisible: () => false,
      }),
      ColumnDef.create({
        property: "target",
        headerLabel: "New Name",
        width: new Size(50, 'weight'),
        minWidth: new Size(200, 'px'),
        headerClasses: ["ge-table-text-align-left"],
        bodyClasses: ["ge-table-text-align-left"],
        bodyRenderer: this.rwf.create(FileItemNameCellRendererComponent, this.cdr),
        sortComparator: fileItemComparator,
        sortable: () => true,
        sortIconVisible: () => true,
      }),
    ];
    this.tableModel = TableFactory.createTableModel({
      rows: this.rows,
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
        this.zone.runOutsideAngular(() => {
          this.multiRenameService.updateTargets(this.rows, {...new MultiRenameData(), ...this.formGroup.getRawValue()});
          this.tableApi?.setRows(this.rows);
          this.tableApi?.repaint();
        });
      });
  }

  onOkClicked() {
    if (this.multiRenameDialogData.data === null) {
      MultiRenameDialogComponent.innerServiceMultiRenameData.update(
        {...new MultiRenameData(), ...this.formGroup.getRawValue()}
      );
    }
    const actionEvents = this.multiRenameService.createActionEvents(this.rows, this.multiRenameDialogData.panelIndex);
    this.dialogRef.close(actionEvents);
  }

  onResetClicked() {
    this.data = new MultiRenameData();
    MultiRenameDialogComponent.innerServiceMultiRenameData.update(this.data);
    this.formGroup.reset(this.data);
    this.multiRenameService.updateTargets(this.rows, this.data);
    this.tableApi?.setRows(this.rows);
    this.tableApi?.repaint();
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onTableReady(tableApi: TableApi) {
    this.tableApi = tableApi
  }

  onMakroClicked(macro: Makro, index: number, replacementForm: AbstractControl<any>) {
    replacementForm.setValue({...macro.data, checked: true});
  }

  openInfo() {
    this.confirmationDialogService.showInfo([
      "To run the AI mode, you'll need an OpenAI account and associated API key (https://platform.openai.com/signup). ",
      "Set an environment variable called `FNF_OPENAI_API_KEY` with your API key.",
      "Alternatively you can create an `.env` file at the root of this app containing `FNF_OPENAI_API_KEY=<your API key>`, which will be picked up by nestjs."
    ]);
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
    this.rows.map(r => {
      r.target.dir = '';
      r.target.base = '';
      r.target.ext = '';
      return r;
    });
    this.cdr.detectChanges();

    this.aiCompletionService
      .convertnames({
        files: this.rows.map(this.aiCompletionService.fileOperationParams2Url),
      })
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(res => {

        this.rows.forEach((r, i) => {
          const url = this.aiCompletionService.fileOperationParams2Url(r);
          if (res[url]) {
            r.target.base = res[url];
          }
        });
        this.tableApi?.setRows(this.rows);
        this.tableApi?.repaint();

        this.fetchAiButtonDisabled = false;
        this.cdr.detectChanges();
      });
  }

  private clone(r: FileItemIf): FileItemIf {
    return JSON.parse(JSON.stringify(r));
  }


}

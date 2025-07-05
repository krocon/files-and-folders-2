import {
  Component,
  effect,
  Inject,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GotoAnythingDialogData} from "./goto-anything-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import {UpperCasePipe} from "@angular/common";
import {GotoAnythingOptionData} from "./goto-anything-option.data";
import {GotoAnythingDialogService} from "./goto-anything-dialog.service";
import {takeWhile} from "rxjs/operators";
import {AppService} from "../../../app.service";


@Component({
  selector: "fnf-goto-anything-dialog",
  templateUrl: "./goto-anything-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatButton,
    MatDialogActions,
    MatFormField,
    FnfAutofocusDirective,
    MatError,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatInput,
    UpperCasePipe
  ],
  styleUrls: ["./goto-anything-dialog.component.css"]
})
export class GotoAnythingDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  error = "";
  errorMesasage = "";
  target = "";

  public alive = true;

  filteredOptions = signal<GotoAnythingOptionData[]>([]);
  searchTerm = signal<string>('');
  volumes: string[] = [];

  private readonly openTabDirsOptions: GotoAnythingOptionData[] = [];
  private localResults = signal<GotoAnythingOptionData[]>([]);
  private remoteResults = signal<GotoAnythingOptionData[]>([]);
  private commandsResults = signal<GotoAnythingOptionData[]>([]);
  private volumesResults = signal<GotoAnythingOptionData[]>([]);
  private injector = inject(Injector);
  private result: GotoAnythingOptionData = new GotoAnythingOptionData('cd', '');



  constructor(
    public dialogRef: MatDialogRef<GotoAnythingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GotoAnythingDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly gotoAnythingDialogService: GotoAnythingDialogService,
    private readonly appService: AppService,
  ) {
    this.openTabDirsOptions.push(...data.dirs.map(s => new GotoAnythingOptionData('cd', s)))
    this.formGroup = this.formBuilder.group(
      {
        target: new FormControl(data.firstInput, [Validators.required, Validators.minLength(1)])
      }
    );
  }


  get hasError(): boolean {
    return false;
  }

  displayFn(option: GotoAnythingOptionData) {
    return option?.value ?? '';
  };

  onOkClicked() {
    this.dialogRef.close(this.result);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      // Set up effect to combine results whenever either source changes
      effect(() => {
        this.filteredOptions.set([
          ...this.commandsResults(),
          ...this.localResults(),
          ...this.remoteResults(),
          ...this.volumesResults()
        ]);
      });
    });
    // Initialize with empty search
    this.updateSearchTerm(this.data.firstInput);

    this.appService
      .getVolumes$()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(volumes => {
        this.volumes = volumes;
        this.volumesResults.set(volumes.map(v => new GotoAnythingOptionData('cd', v)));
      });
  }

  onOptionSelected(evt: MatAutocompleteSelectedEvent) {
    this.result = evt.option.value;
  }

  onKeyup(evt: KeyboardEvent) {
    let target = this.formGroup.getRawValue().target;
    this.result = new GotoAnythingOptionData('cd', target);
    this.updateSearchTerm(target);
  }

  private async fetchFolders(value: string): Promise<void> {
    let results: GotoAnythingOptionData[] = await this.gotoAnythingDialogService.fetchFolders(value, this.data.dirs);
    this.remoteResults.set(results);
  }


  private updateLocalResults(filterValue: string): void {
    this.localResults.set(
      this.openTabDirsOptions
        .filter(option =>
          option.value.toLowerCase().includes(filterValue)
          || option.cmd.toLowerCase().includes(filterValue))
    );
  }

  private updateCommands(value: string): void {
    this.commandsResults.set(this.data.commands
      .filter(
        c => c.cmd.toLowerCase().includes(value) || c.value.toLowerCase().includes(value)
      ));
  }

  private updateSearchTerm(value: string | unknown): void {
    if (!value) value = '';

    if (typeof value === 'string') {
      this.searchTerm.set(value);

      const filterValue = value.toLowerCase();
      // Update sources:
      this.updateCommands(filterValue);
      this.updateLocalResults(filterValue);
      this.fetchFolders(filterValue);
    }
  }
}

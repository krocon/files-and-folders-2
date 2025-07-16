import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit,} from "@angular/core";
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
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {GotoAnythingOptionData} from "./goto-anything-option.data";
import {GotoAnythingDialogService} from "./goto-anything-dialog.service";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {map, takeWhile} from "rxjs/operators";
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
    UpperCasePipe,
    AsyncPipe
  ],
  styleUrls: ["./goto-anything-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GotoAnythingDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  error = "";
  errorMesasage = "";
  target = "";

  public alive = true;

  filteredOptions$: Observable<GotoAnythingOptionData[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  volumes: string[] = [];

  private readonly openTabDirsOptions: GotoAnythingOptionData[] = [];
  private localResults$ = new BehaviorSubject<GotoAnythingOptionData[]>([]);
  private remoteResults$ = new BehaviorSubject<GotoAnythingOptionData[]>([]);
  private commandsResults$ = new BehaviorSubject<GotoAnythingOptionData[]>([]);
  private volumesResults$ = new BehaviorSubject<GotoAnythingOptionData[]>([]);
  result: GotoAnythingOptionData = new GotoAnythingOptionData('cd', '');


  constructor(
    public dialogRef: MatDialogRef<GotoAnythingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GotoAnythingDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly gotoAnythingDialogService: GotoAnythingDialogService,
    private readonly appService: AppService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.openTabDirsOptions.push(...data.dirs.map(s => new GotoAnythingOptionData('cd', s)))
    this.formGroup = this.formBuilder.group(
      {
        target: new FormControl(data.firstInput, [Validators.required, Validators.minLength(1)])
      }
    );
    // Set up combineLatest to combine results whenever any source changes
    this.filteredOptions$ = combineLatest([
      this.commandsResults$,
      this.localResults$,
      this.remoteResults$,
      this.volumesResults$
    ]).pipe(
      map(([commands, local, remote, volumes]) => [
        ...commands,
        ...local,
        ...remote,
        ...volumes
      ])
    );
  }


  get hasError(): boolean {
    return false;
  }

  displayFn(option: GotoAnythingOptionData) {
    return option?.value ?? option ?? '';
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
    // Initialize with empty search
    this.updateSearchTerm(this.data.firstInput);

    this.appService
      .getVolumes$()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(volumes => {
        this.volumes = volumes;
        this.volumesResults$.next(volumes.map(v => new GotoAnythingOptionData('cd', v)));
      });
  }

  onOptionSelected(evt: MatAutocompleteSelectedEvent) {
    this.result = evt.option.value;
    this.formGroup.patchValue({target: this.result.value}, {emitEvent: true});
    this.cdr.detectChanges();
  }

  onKeyup(evt: KeyboardEvent) {
    let target = this.formGroup.getRawValue().target;
    this.result = new GotoAnythingOptionData('cd', target);
    this.updateSearchTerm(target);
  }

  private async fetchFolders(value: string): Promise<void> {
    let results: GotoAnythingOptionData[] = await this.gotoAnythingDialogService.fetchFolders(value, this.data.dirs);
    this.remoteResults$.next(results);
  }


  private updateLocalResults(filterValue: string): void {
    this.localResults$.next(
      this.openTabDirsOptions
        .filter(option =>
          option.value.toLowerCase().includes(filterValue)
          || option.cmd.toLowerCase().includes(filterValue))
    );
  }

  private updateCommands(value: string): void {
    this.commandsResults$.next(this.data.commands
      .filter(
        c => c.cmd.toLowerCase().includes(value) || c.value.toLowerCase().includes(value)
      ));
  }

  private updateSearchTerm(value: string | unknown): void {
    if (!value) value = '';

    if (typeof value === 'string') {
      this.searchTerm$.next(value);

      const filterValue = value.toLowerCase();
      // Update sources:
      this.updateCommands(filterValue);
      this.updateLocalResults(filterValue);
      this.fetchFolders(filterValue);
    }
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {CleanDialogData, CleanResult, WalkData} from "@fnf/fnf-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectFolderDropdownComponent} from "../../common/selectfolderdropdown/select-folder-dropdown.component";
import {CleanTemplateDropdownComponent} from "../../common/cleantemplatedropdown/clean-template-dropdown.component";
import {WalkDataComponent} from "../../../common/walkdir/walk-data.component";
import {GlobValidatorService} from "../../../service/glob-validator.service";
import {globPatternAsyncValidator} from "../../../common/fn/glob-pattern-validator.fn";
import {debounceTime, distinctUntilChanged, takeWhile} from "rxjs/operators";
import {CleanService} from "../../../service/clean.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {WalkdirService} from "../../../common/walkdir/walkdir.service";


@Component({
  selector: "fnf-clean-dialog",
  templateUrl: "./clean-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatDialogActions,
    MatFormField,
    FnfAutofocusDirective,
    MatCheckbox,
    SelectFolderDropdownComponent,
    CleanTemplateDropdownComponent,
    WalkDataComponent,
    MatProgressBar,
  ],
  styleUrls: ["./clean-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  walkData = new WalkData(0, 0, 0, false);
  walkCancelKey = '';
  alive = true;
  public cleaning = false;

  constructor(
    public dialogRef: MatDialogRef<CleanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CleanDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly walkdirService: WalkdirService,
    private readonly cdr: ChangeDetectorRef,
    private readonly globValidatorService: GlobValidatorService,
    private readonly cleanService: CleanService,
  ) {
    const folder = data.folder ? data.folder : data.folders?.join(',');
    this.formGroup = this.formBuilder
      .group(
        {
          folder: new FormControl(folder, {validators: [Validators.required]}),
          pattern: new FormControl(data.pattern, {
            asyncValidators: [globPatternAsyncValidator(this.globValidatorService)]
          }),
          deleteEmptyFolders: new FormControl(data.deleteEmptyFolders)
        },
        {
          validators: [
            (formGroup: AbstractControl): ValidationErrors | null => {
              const pattern = formGroup.get('pattern')?.value;
              const deleteEmptyFolders = formGroup.get('deleteEmptyFolders')?.value;

              if ((!pattern || pattern.trim() === '') && deleteEmptyFolders === false) {
                return {
                  "mandatory": "You need a delete-pattern or delete empty folders to be checked"
                };
              }
              return null;
            }
          ]
        }
      );
    dialogRef.afterClosed()
      .subscribe(result => {
        if (this.walkCancelKey) {
          this.walkdirService.cancelWalkDir(this.walkCancelKey);
        }
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.formGroup
      .valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(
        () => {
          if (!this.formGroup.invalid) {
            this.onCheckClicked();
          }
        }
      );
    this.onCheckClicked();
  }

  onOkClicked() {
    this.cleaning = true;
    this.updateFormControlsState();
    this.cdr.detectChanges();
    this.cleanService
      .clean(this.formGroup.getRawValue())
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: CleanResult) => {
        this.cleaning = false;
        this.updateFormControlsState();
        this.cdr.detectChanges();
        this.dialogRef.close(res);
      });
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  onCheckClicked() {
    if (this.walkCancelKey) {
      this.walkdirService.cancelWalkDir(this.walkCancelKey);
    }
    this.walkData = new WalkData(0, 0, 0, false);
    this.cdr.detectChanges();

    let rawValue = this.formGroup.getRawValue();
    let folders = rawValue.folder.split(',');
    let pattern = rawValue.pattern ?? '';


    this.walkCancelKey = this.walkdirService
      .walkDir(
        folders,
        pattern,
        (walkData: WalkData) => {
          this.walkData = walkData;
          this.cdr.detectChanges();
        });
  }

  onSearchTemplateSelected(evt: string) {
    const p = '{'
      + evt
        .split('|')
        .join(',')
      + '}';

    this.formGroup?.get('pattern')?.setValue(p, {emitEvent: true});
  }

  onFolderClicked(evt: string) {
    this.formGroup?.get('folder')?.setValue(evt, {emitEvent: true});
  }

  private updateFormControlsState() {
    if (this.cleaning) {
      this.formGroup.get('folder')?.disable();
      this.formGroup.get('pattern')?.disable();
      this.formGroup.get('deleteEmptyFolders')?.disable();
    } else {
      this.formGroup.get('folder')?.enable();
      this.formGroup.get('pattern')?.enable();
      this.formGroup.get('deleteEmptyFolders')?.enable();
    }
  }
}

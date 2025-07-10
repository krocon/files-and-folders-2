import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
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
import {CleanDialogData, WalkData} from "@fnf/fnf-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectFolderDropdownComponent} from "../../common/selectfolderdropdown/select-folder-dropdown.component";
import {CleanTemplateDropdownComponent} from "../../common/cleantemplatedropdown/clean-template-dropdown.component";
import {WalkDataComponent} from "../../../common/walkdata/walk-data.component";
import {WalkSocketService} from "../../../service/walk.socketio.service";
import {GlobValidatorService} from "../../../service/glob-validator.service";
import {map, Observable} from "rxjs";


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
  ],
  styleUrls: ["./clean-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CleanDialogComponent implements OnInit {

  formGroup: FormGroup;
  walkData = new WalkData(0, 0, 0, false);
  walkCancelKey = '';


  /**
   * Async validator that validates a glob pattern using the API.
   * @param globValidatorService The service to use for validation
   * @returns An async validator function
   */
  static globPatternAsyncValidator(globValidatorService: GlobValidatorService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      // Allow empty values
      if (!value || value.trim() === '') {
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      }

      // Call the API to validate the pattern
      return globValidatorService.validateGlobPattern(value).pipe(
        map(isValid => {
          if (isValid) {
            console.info('Valid glob pattern ' + value);
            return null;
          } else {
            console.error('Invalid glob pattern', value);
            return {invalidGlobPattern: 'Invalid glob pattern'};
          }
        })
      );
    };
  }

  constructor(
    public dialogRef: MatDialogRef<CleanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CleanDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly walkSocketService: WalkSocketService,
    private readonly cdr: ChangeDetectorRef,
    private readonly globValidatorService: GlobValidatorService,
  ) {
    const folder = data.folder ? data.folder : data.folders?.join(',');
    this.formGroup = this.formBuilder
      .group(
        {
          folder: new FormControl(folder, {validators: [Validators.required]}),
          pattern: new FormControl(data.pattern, {
            asyncValidators: [CleanDialogComponent.globPatternAsyncValidator(this.globValidatorService)]
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
          this.walkSocketService.cancelWalkDir(this.walkCancelKey);
        }
      });
  }

  ngOnInit(): void {
  }

  onOkClicked() {
    // TODO this.dialogRef.close(this.formGroup.getRawValue());
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


  onCheckClicked() {
    if (this.walkCancelKey) {
      this.walkSocketService.cancelWalkDir(this.walkCancelKey);
    }
    this.walkData = new WalkData(0, 0, 0, false);
    this.cdr.detectChanges();

    let rawValue = this.formGroup.getRawValue();
    let folders = rawValue.folder.split(',');
    let pattern = rawValue.pattern ?? '';
    this.walkCancelKey = this.walkSocketService
      .walkDir(
        folders,
        pattern,
        (walkData: WalkData) => {
          console.info('walkData', walkData); // TODO del
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
}

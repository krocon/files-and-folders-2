import {Component, Inject} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {RenameDialogData} from "./rename-dialog.data";
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
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";
import {MatTooltip} from "@angular/material/tooltip";
import {RenameDialogResultData} from "./rename-dialog-result.data";
import {FnfFilenameValidation} from "../../../common/fnf-filename-validation";

@Component({
  selector: "fnf-rename-dialog",
  templateUrl: "./rename-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatFormField,
    FnfAutofocusDirective,
    MatError,
    MatTooltip
  ],
  styleUrls: ["./rename-dialog.component.css"]
})
export class RenameDialogComponent {

  formGroup: FormGroup;
  sourceTooltip = "";


  constructor(
    public dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RenameDialogData,
    private readonly formBuilder: FormBuilder,
  ) {

    this.sourceTooltip = data.source.dir + '/' + data.source.base;
    this.formGroup = this.formBuilder.group(
      {
        source: new FormControl({
          value: data.source.base,
          disabled: true
        }),
        target: new FormControl(
          data.source.base,
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(255),
              (control: AbstractControl): ValidationErrors | null => {
                if (control.value === data.source.base) {
                  return {
                    "is_same": true
                  };
                }
                return null;
              },
              FnfFilenameValidation.validateSpecialNames,
              FnfFilenameValidation.validateChars,
              FnfFilenameValidation.validateReservedNames,
              FnfFilenameValidation.validateStartEndChars,
              FnfFilenameValidation.checkSpacesUnderscores,
            ]
          })
      }
    );
  }


  get errorMessage(): string {
    const targetControl = this.formGroup.get('target');
    if (!targetControl || !targetControl.errors) return '';

    // Use the common error message function
    const isFolder = this.data.source.isDir;
    return FnfFilenameValidation.getErrorMessage(targetControl.errors, isFolder);
  }


  onOkClicked() {
    const target = {
      ...this.data.source,
      base: this.formGroup.getRawValue().target,
    };

    this.dialogRef.close(new RenameDialogResultData(
      this.data.source,
      target
    ));
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

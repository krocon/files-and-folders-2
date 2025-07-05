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
import {MkdirDialogData} from "./mkdir-dialog.data";
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
import {MkdirDialogResultData} from "./mkdir-dialog-result.data";
import {FileItem} from "@fnf/fnf-data";
import {FnfFilenameValidation} from "../../../common/fnf-filename-validation";

@Component({
  selector: "fnf-mkdir-dialog",
  templateUrl: "./mkdir-dialog.component.html",
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
    MatError
  ],
  styleUrls: ["./mkdir-dialog.component.css"]
})
export class MkdirDialogComponent {

  formGroup: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<MkdirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MkdirDialogData,
    private readonly formBuilder: FormBuilder,
  ) {

    this.formGroup = this.formBuilder.group(
      {
        target: new FormControl(
          data.folderName,
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(255),
              (control: AbstractControl): ValidationErrors | null => {
                if (control.value === data.folderName) {
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
              // FnfFilenameValidation.checkSpacesUnderscores,
            ]
          })
      }
    );
  }


  get errorMessage(): string {
    const targetControl = this.formGroup.get('target');
    if (!targetControl || !targetControl.errors) return '';

    // Use the common error message function - this is always a folder
    return FnfFilenameValidation.getErrorMessage(targetControl.errors, true);
  }


  onOkClicked() {
    this.dialogRef
      .close(new MkdirDialogResultData(
        new FileItem(this.data.source, this.formGroup.getRawValue().target)
      ));
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

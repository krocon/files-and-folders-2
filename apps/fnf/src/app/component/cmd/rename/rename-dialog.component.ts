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
              (control: AbstractControl): ValidationErrors | null => {
                // Check for invalid characters in file name
                // Allow letters, numbers, spaces, and common special characters like ._-()[]{}
                const validFilenameRegex = /^[a-zA-Z0-9\s._\-()[\]{}]+$/;
                if (!validFilenameRegex.test(control.value)) {
                  return {
                    "invalid_chars": true
                  };
                }
                return null;
              },
            ]
          })
      }
    );
  }


  get errorMessage(): string {
    const targetControl = this.formGroup.get('target');
    if (!targetControl || !targetControl.errors) return '';

    if (targetControl.errors['required']) {
      return 'Filename is required';
    }
    if (targetControl.errors['minlength']) {
      return 'Filename must be at least 2 characters long';
    }
    if (targetControl.errors['maxlength']) {
      return 'Filename cannot exceed 255 characters';
    }
    if (targetControl.errors['is_same']) {
      return 'The new filename must be different from the original';
    }
    if (targetControl.errors['invalid_chars']) {
      return 'Filename contains invalid characters. Use only letters, numbers, spaces, and ._-()[]{}';
    }

    return 'Invalid filename';
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

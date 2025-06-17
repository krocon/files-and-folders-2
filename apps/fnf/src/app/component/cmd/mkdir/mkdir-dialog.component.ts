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
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";
import {MkdirDialogResultData} from "./mkdir-dialog-result.data";
import {FileItem} from "@fnf/fnf-data";

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
              (control: AbstractControl): ValidationErrors | null => {
                if (control.value === '..') {
                  return {
                    "invalid_name": true
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
      return 'Folder name is required';
    }
    if (targetControl.errors['minlength']) {
      return 'Folder name must be at least 2 characters long';
    }
    if (targetControl.errors['maxlength']) {
      return 'Folder name cannot exceed 255 characters';
    }
    if (targetControl.errors['is_same']) {
      return 'The new folder name must be different';
    }
    if (targetControl.errors['invalid_chars']) {
      return 'Folder name contains invalid characters. Use only letters, numbers, spaces, and ._-()[]{}';
    }
    if (targetControl.errors['invalid_name']) {
      return 'Folder name contains an invalid name';
    }

    return 'Invalid folder name';
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

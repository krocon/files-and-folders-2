import {Component, Inject} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectionDialogData} from "./selection-dialog.data";
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

@Component({
  selector: "fnf-selection-dialog",
  templateUrl: "./selection-dialog.component.html",
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
  styleUrls: ["./selection-dialog.component.css"]
})
export class SelectionDialogComponent {

  title = 'Enhance Selection'
  formGroup: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectionDialogData,
    private readonly formBuilder: FormBuilder,
  ) {
    this.title = data.enhance ? 'Enhance Selection':'Reduce Selection';
    this.formGroup = this.formBuilder.group(
      {
        text: new FormControl(
          data.text,
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(255),
            ]
          })
      }
    );
  }


  onOkClicked() {
    this.dialogRef.close(this.formGroup.getRawValue().text);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";
import {FindDialogData} from "@fnf/fnf-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: "fnf-openFindDialog-dialog",
  templateUrl: "./find-dialog.component.html",
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
    MatCheckbox
  ],
  styleUrls: ["./find-dialog.component.css"]
})
export class FindDialogComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FindDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FindDialogData,
    private readonly formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        folder: new FormControl(
          data.folder,
          {
            validators: [
              Validators.required,
            ]
          }),
        pattern: new FormControl(
          data.pattern,
          {
            validators: [
              Validators.required,
            ]
          }),
        directoriesOnly: new FormControl(data.directoriesOnly, {}),
        newtab: new FormControl(data.newtab, {})
      }
    );
  }

  ngOnInit(): void {
  }


  onOkClicked() {
    this.dialogRef.close(this.formGroup.getRawValue());
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

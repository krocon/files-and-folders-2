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
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {CleanDialogData} from "@fnf/fnf-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectFolderDropdownComponent} from "../../common/selectfolderdropdown/select-folder-dropdown.component";
import {CleanTemplateDropdownComponent} from "../../common/cleantemplatedropdown/clean-template-dropdown.component";


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
  ],
  styleUrls: ["./clean-dialog.component.css"]
})
export class CleanDialogComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CleanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CleanDialogData,
    private readonly formBuilder: FormBuilder,
  ) {
    const folder = data.folder ? data.folder : data.folders?.join(',');
    this.formGroup = this.formBuilder
      .group(
        {
          folder: new FormControl(
            folder,
            {
              validators: [
                Validators.required,
              ]
            }),
          pattern: new FormControl(
            data.pattern,
            {
              validators: [

              ]
            }),
          //directoriesOnly: new FormControl(data.directoriesOnly, {}),
          deleteEmptyFolders: new FormControl(data.deleteEmptyFolders, {})
        }
      );
  }

  ngOnInit(): void {
  }


  onOkClicked() {
    // TODO this.dialogRef.close(this.formGroup.getRawValue());
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


  onSearchTemplateSelected(evt: string) {
    const p = '{'
      + evt
        .split('|')
        //.map(s => '**/*' + s)
        .join(',')
      + '}';

    this.formGroup?.get('pattern')?.setValue(p, {emitEvent: true});
  }

  onFolderClicked(evt: string) {
    this.formGroup?.get('folder')?.setValue(evt, {emitEvent: true});
  }
}

import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultiRenameDialogData} from "./data/multi-rename-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FileItem} from "@fnf/fnf-data";

import {takeWhile} from "rxjs/operators";
import {FnfFileSizePipe} from "../../../common/fnf-file-size.pipe";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";
import {MultiRenameData} from "./data/multi-rename.data";
import {MultiRenameOptions} from "./data/multi-rename-options";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: "fnf-multi-rename-dialog",
  templateUrl: "./multi-rename-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FnfFileSizePipe,
    ReactiveFormsModule,
    MatIconModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatFormField,
    FnfAutofocusDirective,
    MatError,
    MatSelect,
    MatOption,
    MatLabel,
    MatCheckbox
  ],
  styleUrls: ["./multi-rename-dialog.component.css"]
})
export class MultiRenameDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  source = "";
  data: MultiRenameData;
  options: MultiRenameOptions;

  private alive = true;

  constructor(
    public dialogRef: MatDialogRef<MultiRenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public multiRenameDialogData: MultiRenameDialogData,
    private readonly formBuilder: FormBuilder,
    // private readonly walkSocketService: WalkSocketService
  ) {
    console.info(multiRenameDialogData);
    this.data = multiRenameDialogData.data;
    this.options = multiRenameDialogData.options;

    this.formGroup = this.formBuilder.group(
      {
        name: new FormControl(this.data.name, [Validators.required, Validators.minLength(1)]),
        capitalizeMode: new FormControl(this.data.capitalizeMode, []),
        counterStart: new FormControl(this.data.counterStart, []),
        counterStep: new FormControl(this.data.counterStep, []),
        counterDigits: new FormControl(this.data.counterDigits, []),
        replaceGermanUmlauts: new FormControl(this.data.replaceGermanUmlauts, []),
        replaceRiskyChars: new FormControl(this.data.replaceRiskyChars, []),
        replaceSpaceToUnderscore: new FormControl(this.data.replaceSpaceToUnderscore, []),
        replaceParentDir: new FormControl(this.data.replaceParentDir, []),
      }
    );

    dialogRef
      .afterOpened()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        //
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
  }

  onOkClicked() {
    // const fileItem = new FileItem(this.data.target, this.formGroup.getRawValue().name, "");
    // fileItem.isDir = true;
    // this.dialogRef.close(fileItem);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

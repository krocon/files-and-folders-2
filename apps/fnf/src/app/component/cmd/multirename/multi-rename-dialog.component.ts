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
import {MatError, MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";

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
    MatError
  ],
  styleUrls: ["./multi-rename-dialog.component.css"]
})
export class MultiRenameDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  source = "";

  private alive = true;

  constructor(
    public dialogRef: MatDialogRef<MultiRenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultiRenameDialogData,
    private readonly formBuilder: FormBuilder,
    // private readonly walkSocketService: WalkSocketService
  ) {
    console.info(data);

    this.formGroup = this.formBuilder.group(
      {
        // rows: new FormControl(this.rows, []),
        //target: new FormControl(data.target, [Validators.required, Validators.minLength(1)])
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

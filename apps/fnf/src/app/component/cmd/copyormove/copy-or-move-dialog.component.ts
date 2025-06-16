import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CopyOrMoveDialogData} from "./copy-or-move-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FileItem, WalkData} from "@fnf/fnf-data";

import {takeWhile} from "rxjs/operators";
import {FileOperation} from "./file-operation";
import {FnfFileSizePipe} from "../../../common/fnf-file-size.pipe";
import {MatError, MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {WalkSocketService} from "../../../service/walk.socketio.service";
import {FnfAutofocusDirective} from "../../../common/fnf-autofocus.directive";

@Component({
  selector: "fnf-copy-or-move-dialog",
  templateUrl: "./copy-or-move-dialog.component.html",
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
  styleUrls: ["./copy-or-move-dialog.component.css"]
})
export class CopyOrMoveDialogComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  error = "";
  errorMesasage = "";
  walkData = new WalkData(0, 0, 0, false);

  title = "Copy";
  source = "";
  sourceTooltip = "";
  focusOnTarget = false;
  deleteMode = false;

  private alive = true;

  constructor(
    public dialogRef: MatDialogRef<CopyOrMoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CopyOrMoveDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly walkSocketService: WalkSocketService
  ) {
    this.title = this.getTitleByKey(data?.fileOperation);
    this.deleteMode = data?.fileOperation === "delete";

    if (data.source.length > 1) {
      this.source = data.source.length + " items";
    } else {
      this.source = data.source[0];
    }
    this.sourceTooltip = data.source.join("\n");

    if (this.deleteMode) {
      this.formGroup = this.formBuilder.group({});
    } else {
      this.formGroup = this.formBuilder.group(
        {
          // source: new FormControl(this.source, []),
          target: new FormControl(data.target, [Validators.required, Validators.minLength(1)])
        }
      );
    }
    dialogRef
      .afterOpened()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.focusOnTarget = !this.deleteMode;
      });
  }

  get hasError(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
    this.walkSocketService.walkDir(this.data.source, (walkData: WalkData) => this.walkData = walkData);

  }

  onOkClicked() {
    const fileItem = new FileItem(this.data.target, this.formGroup.getRawValue().name, "");
    fileItem.isDir = true;
    this.dialogRef.close(fileItem);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  private getTitleByKey(key: FileOperation): string {
    const m = {
      copy: "Copy",
      move: "Move",
      delete: "Delete"
    };
    return m[key];
  }

}

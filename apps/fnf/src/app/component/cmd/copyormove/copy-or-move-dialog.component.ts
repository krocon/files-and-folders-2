import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
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
import {MatError, MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {WalkSocketService} from "../../../service/walk.socketio.service";
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AppService} from "../../../app.service";
import {getAllParents} from "../../../common/fn/get-all-parents.fn";

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
    MatError,
    MatDivider,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatSuffix,
    MatMenuTrigger
  ],
  styleUrls: ["./copy-or-move-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyOrMoveDialogComponent implements OnInit, OnDestroy {

  suggestions: string[] = [];

  formGroup: FormGroup;
  error = "";
  errorMesasage = "";
  walkData = new WalkData(0, 0, 0, false);
  walkCancelKey = '';

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
    private readonly walkSocketService: WalkSocketService,
    private readonly cdr: ChangeDetectorRef,
    private readonly appService: AppService,
  ) {
    this.title = this.getTitleByKey(data?.fileOperation);
    this.deleteMode = data?.fileOperation === "delete";

    if (data.source.length > 1) {
      this.source = data.source.length + " items";
    } else {
      this.source = data.source[0];
    }
    this.sourceTooltip = data.source.join("\n");

    // if (this.deleteMode) {
    //   this.formGroup = this.formBuilder.group({});
    // } else {
      this.formGroup = this.formBuilder.group(
        {
          // source: new FormControl(this.source, []),
          target: new FormControl(data.target, [
            Validators.required,
            Validators.minLength(1),
            Validators.pattern(/^(?!tabfind).*$/)
          ])
        }
      );
    // }
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
    this.walkSocketService.cancelWalkDir(this.walkCancelKey);
  }

  ngOnInit(): void {
    this.alive = true;
    this.walkCancelKey = this.walkSocketService
      .walkDir(
        this.data.source,
        (walkData: WalkData) => {
          this.walkData = walkData;
          this.cdr.detectChanges();
        });
    this.createSuggestions();
  }

  private createSuggestions() {
    const dirs = [...new Set([
      ...this.appService.latest,
      ...this.appService.favs
    ])];

    const dirs2: string[] = [];
    for (const dir of dirs) {
      dirs2.push(dir);
      getAllParents(dir).forEach(
        (parent: string) => {
          if (!dirs2.includes(parent)) {
            dirs2.push(parent);
          }
        }
      )
      dirs2.push()
    }
    this.suggestions = [...new Set(dirs2)].sort();
  }

  onSuggestionClicked(suggestion: string) {
    this.formGroup.setValue({target: suggestion}, {emitEvent: true});
  }

  onOkClicked() {
    const formData = this.formGroup.getRawValue();
    const fileItem = new FileItem(formData.target, formData.name, "");
    fileItem.isDir = true;
    this.walkSocketService.cancelWalkDir(this.walkCancelKey);
    this.dialogRef.close(fileItem);
  }

  onCancelClicked() {
    this.walkSocketService.cancelWalkDir(this.walkCancelKey);
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

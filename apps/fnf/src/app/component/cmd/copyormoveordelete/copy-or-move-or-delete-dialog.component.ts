import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CopyOrMoveOrDeleteDialogData} from "./copy-or-move-or-delete-dialog.data";
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
import {MatError, MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AppService} from "../../../app.service";
import {getAllParents} from "../../../common/fn/get-all-parents.fn";
import {WalkDataComponent} from "../../../common/walkdir/walk-data.component";
import {WalkdirService} from "../../../common/walkdir/walkdir.service";

@Component({
  selector: "fnf-copy-or-move-dialog",
  templateUrl: "./copy-or-move-or-delete-dialog.component.html",
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
    MatDivider,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatSuffix,
    MatMenuTrigger,
    WalkDataComponent
  ],
  styleUrls: ["./copy-or-move-or-delete-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyOrMoveOrDeleteDialogComponent implements OnInit, OnDestroy {

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
    public dialogRef: MatDialogRef<CopyOrMoveOrDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CopyOrMoveOrDeleteDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly walkdirService: WalkdirService,
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

    this.formGroup = this.formBuilder.group(
      {
        // source: new FormControl(this.source, []),
        target: new FormControl(data.target,
          this.deleteMode ? [] :
            [
              Validators.required,
              Validators.minLength(1),
              Validators.pattern(/^(?!tabfind).*$/)
            ])
      }
    );

    dialogRef
      .afterOpened()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.focusOnTarget = !this.deleteMode;
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        if (this.walkCancelKey) {
          this.walkdirService.cancelWalkDir(this.walkCancelKey);
        }
      });
  }

  get hasError(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.walkdirService.cancelWalkDir(this.walkCancelKey);
  }

  ngOnInit(): void {
    this.alive = true;
    // start scanning selected files/folders:
    this.walkCancelKey = this.walkdirService
      .walkDir(
        this.data.source,
        '**/*',
        (walkData: WalkData) => {
          this.walkData = walkData;
          this.cdr.detectChanges();
        });
    this.createSuggestions();
  }

  onSuggestionClicked(suggestion: string) {
    this.formGroup.setValue({target: suggestion}, {emitEvent: true});
  }

  onOkClicked() {
    const formData = this.formGroup.getRawValue();
    const fileItem = new FileItem(formData.target, formData.name, "");
    fileItem.isDir = true;
    this.dialogRef.close(fileItem);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
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

  private getTitleByKey(key: FileOperation): string {
    const m = {
      copy: "Copy",
      move: "Move",
      delete: "Delete"
    };
    return m[key];
  }

}

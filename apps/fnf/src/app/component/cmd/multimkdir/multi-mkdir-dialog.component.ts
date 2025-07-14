import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MultiMkdirDialogData} from "./data/multi-mkdir-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

import {takeWhile} from "rxjs/operators";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MultiMkdirData} from "./data/multi-mkdir.data";
import {MultiMkdirOptions} from "./data/multi-mkdir-options";
import {MatOption, MatSelect} from "@angular/material/select";
import {debounceTime} from "rxjs";
import {MultiMkdirService} from "./multi-mkdir.service";
import {TypedDataService} from "../../../common/typed-data.service";

@Component({
  selector: "fnf-multi-mkdir-dialog",
  templateUrl: "./multi-mkdir-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel
  ],
  styleUrls: ["./multi-mkdir-dialog.component.css"]
})
export class MultiMkdirDialogComponent implements OnInit, OnDestroy {

  private static readonly innerServiceMultiMkdirData = new TypedDataService<MultiMkdirData>("multiMkdirData", new MultiMkdirData());

  parentDir: string;

  formGroup: FormGroup;
  data: MultiMkdirData;
  options: MultiMkdirOptions;
  directoryNames: string[] = [];

  private alive = true;


  constructor(
    public dialogRef: MatDialogRef<MultiMkdirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public multiMkdirDialogData: MultiMkdirDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly multiMkdirService: MultiMkdirService
  ) {
    this.data = multiMkdirDialogData.data ? multiMkdirDialogData.data : MultiMkdirDialogComponent.innerServiceMultiMkdirData.getValue();
    this.options = multiMkdirDialogData.options as MultiMkdirOptions;
    this.parentDir = multiMkdirDialogData.parentDir;
    this.formGroup = this.formBuilder.group(
      {
        folderNameTemplate: new FormControl(this.data.folderNameTemplate, [Validators.required, Validators.minLength(1)]),
        counterStart: new FormControl(this.data.counterStart, []),
        counterStep: new FormControl(this.data.counterStep, []),
        counterEnd: new FormControl(this.data.counterEnd, []),
        counterDigits: new FormControl(this.data.counterDigits, [])
      }
    );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;

    this.formGroup.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.updateDirectoryNames(formValue);
      });

    // Initial update
    this.updateDirectoryNames(this.formGroup.value);
  }

  onCreateAllClicked() {
    if (this.multiMkdirDialogData.data === null) {
      MultiMkdirDialogComponent.innerServiceMultiMkdirData.update(
        {...new MultiMkdirData(), ...this.formGroup.getRawValue()}
      );
    }
    this.dialogRef.close(this.directoryNames);
  }

  onResetClicked() {
    this.data = new MultiMkdirData();
    MultiMkdirDialogComponent.innerServiceMultiMkdirData.update(this.data);
    this.formGroup.reset(this.data);
    this.updateDirectoryNames(this.data);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }

  private updateDirectoryNames(formValue: any) {
    const data = {...new MultiMkdirData(), ...formValue};
    this.directoryNames = this.multiMkdirService.generateDirectoryNames(data, this.parentDir);
    this.cdr.detectChanges();
  }
}
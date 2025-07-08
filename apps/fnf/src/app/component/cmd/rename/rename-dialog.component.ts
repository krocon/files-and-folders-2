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
import {RenameDialogData} from "./rename-dialog.data";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {MatTooltip} from "@angular/material/tooltip";
import {RenameDialogResultData} from "./rename-dialog-result.data";
import {FnfFilenameValidation} from "../../../common/fnf-filename-validation";
import {MatDivider} from "@angular/material/divider";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {cleanFileName} from "../../../common/fn/clean-file.name.fn";

@Component({
  selector: "fnf-rename-dialog",
  templateUrl: "./rename-dialog.component.html",
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
    MatTooltip,
    MatDivider,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatSuffix,
    MatMenuTrigger
  ],
  styleUrls: ["./rename-dialog.component.css"]
})
export class RenameDialogComponent {

  formGroup: FormGroup;
  sourceTooltip = "";

  suggestions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RenameDialogData,
    private readonly formBuilder: FormBuilder,
  ) {

    this.sourceTooltip = data.source.dir + '/' + data.source.base;
    this.formGroup = this.formBuilder.group(
      {
        source: new FormControl({
          value: data.source.base,
          disabled: true
        }),
        target: new FormControl(
          data.source.base,
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(255),
              (control: AbstractControl): ValidationErrors | null => {
                if (control.value === data.source.base) {
                  return {
                    "is_same": true
                  };
                }
                return null;
              },
              FnfFilenameValidation.validateSpecialNames,
              FnfFilenameValidation.validateChars,
              FnfFilenameValidation.validateReservedNames,
              FnfFilenameValidation.validateStartEndChars,
              // FnfFilenameValidation.checkSpacesUnderscores,
            ]
          })
      }
    );
    this.createSuggestions();
  }

  private createSuggestions(){
    let fileItem = this.data.source;
    const base = fileItem.base;
    const ext = fileItem.ext;
    const dir = fileItem.dir;
    const full = dir+'/'+base;

    let allParents = dir.split('/').map(s=>s+ext);

    const arr = [
      allParents[allParents.length-1],
      allParents[allParents.length-2],
      base.replace(/[^a-zA-Z0-9-]/g, ' ') + ext
    ];
    this.suggestions= [
      ...arr,
      ...arr.map(s=> cleanFileName(s) + ext),
    ];
  }

  get errorMessage(): string {
    const targetControl = this.formGroup.get('target');
    if (!targetControl || !targetControl.errors) return '';

    // Use the common error message function
    const isFolder = this.data.source.isDir;
    return FnfFilenameValidation.getErrorMessage(targetControl.errors, isFolder);
  }


  onOkClicked() {
    const target = {
      ...this.data.source,
      base: this.formGroup.getRawValue().target,
    };

    this.dialogRef.close(new RenameDialogResultData(
      this.data.source,
      target
    ));
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


  onSuggestionClicked(suggestion: string) {
    this.formGroup.setValue({target: suggestion}, {emitEvent: true});
  }
}

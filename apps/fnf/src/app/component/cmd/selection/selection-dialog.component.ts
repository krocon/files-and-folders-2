import {Component, Inject, OnInit} from "@angular/core";
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
import {FnfAutofocusDirective} from "../../../common/directive/fnf-autofocus.directive";
import {FiletypeExtensionsService} from "../../../service/filetype-extensions.service";
import {FiletypeExtensionsIf} from "@fnf/fnf-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {cssThemes} from "../../../domain/customcss/css-theme-type";

@Component({
  selector: "fnf-selection-dialog",
  templateUrl: "./selection-dialog.component.html",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatButton,
    MatDialogActions,
    MatFormField,
    FnfAutofocusDirective,
    MatError,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  styleUrls: ["./selection-dialog.component.css"]
})
export class SelectionDialogComponent implements OnInit {

  title = 'Enhance Selection'
  formGroup: FormGroup;
  filetypeExtensions:FiletypeExtensionsIf[] = [
    {"label": "movies", "extensions": [".avi", ".mkv", ".mp4", ".mov", ".wmv", ".flv", ".webm"]},
    {"label": "audio", "extensions": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma", ".m4a"]},
    {"label": "images", "extensions": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg", ".heic"]},
    {"label": "documents", "extensions": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".txt", ".rtf", ".md"]},
    {"label": "archives", "extensions": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".iso"]},
    {"label": "code", "extensions": [".html", ".css", ".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".c", ".cpp", ".cs", ".rb", ".php", ".go", ".rs", ".sh", ".xml", ".json", ".yml", ".yaml", ".sql"]},
    {"label": "executables", "extensions": [".exe", ".msi", ".bat", ".sh", ".apk", ".app", ".jar", ".com", ".bin", ".cmd"]},
    {"label": "fonts", "extensions": [".ttf", ".otf", ".woff", ".woff2", ".eot"]},
    {"label": "ebooks", "extensions": [".epub", ".mobi", ".azw", ".azw3", ".fb2", ".cbz", ".cbr"]},
    {"label": "design", "extensions": [".psd", ".ai", ".xd", ".sketch", ".fig", ".indd", ".cdr"]},
    {"label": "3d", "extensions": [".obj", ".fbx", ".stl", ".dae", ".3ds", ".blend"]}
  ];

  constructor(
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectionDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly filetypeExtensionsService: FiletypeExtensionsService,
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

  ngOnInit(): void {
    this.filetypeExtensionsService
      .getFiletypes()
      .subscribe(data => this.filetypeExtensions = data);
    }


  onOkClicked() {
    this.dialogRef.close(this.formGroup.getRawValue().text);
  }

  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


  protected readonly themes = cssThemes;

  setText(fe: FiletypeExtensionsIf) {
    this.formGroup.setValue({text: fe.extensions.join("|")}, {emitEvent: true});
  }
}

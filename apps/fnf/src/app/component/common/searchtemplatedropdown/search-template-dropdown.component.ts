import {Component, EventEmitter, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";


type FileExtensionsType = { "label": string, "extensions": string[] };

@Component({
  selector: "fnf-search-template-dropdown",
  templateUrl: "./search-template-dropdown.component.html",
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,

  ]
})
export class SearchTemplateDropdownComponent {

  // TODO load via backend (apps/fnf/src/assets/config/filetype/filetype-extensions.json)
  fileTypes: FileExtensionsType[] = [
    {"label": "movies", "extensions": [".avi", ".mkv", ".mp4", ".mov", ".wmv", ".flv", ".webm"]},
    {
      "label": "movies & images",
      "extensions": [".avi", ".mkv", ".mp4", ".mov", ".wmv", ".flv", ".webm", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg", ".heic"]
    },
    {"label": "audio", "extensions": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma", ".m4a"]},
    {"label": "images", "extensions": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg", ".heic"]},
    {
      "label": "documents",
      "extensions": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".txt", ".rtf", ".md"]
    },
    {"label": "archives", "extensions": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".iso"]},
    {
      "label": "code",
      "extensions": [".html", ".css", ".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".c", ".cpp", ".cs", ".rb",
        ".php", ".go", ".rs", ".sh", ".xml", ".json", ".yml", ".yaml", ".sql"]
    },
    {
      "label": "executables",
      "extensions": [".exe", ".msi", ".bat", ".sh", ".apk", ".app", ".jar", ".com", ".bin", ".cmd"]
    },
    {"label": "fonts", "extensions": [".ttf", ".otf", ".woff", ".woff2", ".eot"]},
    {"label": "ebooks", "extensions": [".epub", ".mobi", ".azw", ".azw3", ".fb2", ".cbz", ".cbr"]},
    {"label": "design", "extensions": [".psd", ".ai", ".xd", ".sketch", ".fig", ".indd", ".cdr"]},
    {"label": "3d", "extensions": [".obj", ".fbx", ".stl", ".dae", ".3ds", ".blend"]}
  ];

  @Output() onSelected = new EventEmitter<string>();


  onItemClicked(ft: FileExtensionsType) {
    this.onSelected.emit(ft.extensions.join('|'));
  }

}

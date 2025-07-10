import {Component, EventEmitter, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";


type FileExtensionsType = { "label": string, "extensions": string[] };

@Component({
  selector: "fnf-clean-template-dropdown",
  templateUrl: "./clean-template-dropdown.component.html",
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,

  ]
})
export class CleanTemplateDropdownComponent {


  fileTypes: FileExtensionsType[] = [
    {"label": "Warez", "extensions": ["**/*.nfo", "**/*sample.mkv", "**/Sample", "**/Proof"]},
  ];

  @Output() onSelected = new EventEmitter<string>();


  onItemClicked(ft: FileExtensionsType) {
    this.onSelected.emit(ft.extensions.join('|'));
  }

}

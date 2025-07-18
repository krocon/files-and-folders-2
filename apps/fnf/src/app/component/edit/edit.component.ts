import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";

@Component({
  selector: "fnf-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ['edit.component.css'],
  imports: [
    FormsModule,
    EditorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  text: string = 'function x() {\n\tconsole.log("Hello world!");\n}';

  constructor(
    // private readonly cdr: ChangeDetectorRef,
    // private readonly zone: NgZone,
  ) {
  }


  ngOnInit(): void {

  }


}

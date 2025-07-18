import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "fnf-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ['edit.component.css'],
  imports: [
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit, AfterViewInit {

  editorOptions = {theme: 'vs-dark', language: 'text'};
  text: string = 'function x() {\n\tconsole.log("Hello world!");\n}';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone,
  ) {
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const domElement = document.querySelector(".monaco-editor");
      const options = {
        value: "// First line\nfunction hello() {\n\talert('Hello world!');\n}\n// Last line",
        language: "text",

        lineNumbers: "off",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: "vs-dark",
      };
      const editor = monaco.editor.create(domElement, options);
      setTimeout(function () {
        editor.updateOptions({
          lineNumbers: "on",
        });
      }, 2000);
    });
  }

  ngOnInit(): void {

  }


}

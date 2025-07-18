import {ChangeDetectionStrategy, Component} from "@angular/core";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "fnf-edit",
  template: `

    <ngx-monaco-editor
        class="ngx-monaco-editor"
        [options]="editorOptions"
        [(ngModel)]="text"></ngx-monaco-editor>
  `,
  styles: [`
      .ngx-monaco-editor {
          width: 100vw;
          height: 100vh;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorComponent,
    FormsModule
  ]
})
export class EditComponent {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  text: string = 'function x() {\nconsole.log("Hello world!");\n}';

}

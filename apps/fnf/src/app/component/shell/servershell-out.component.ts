import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FnfEditorComponent} from "../common/editor/fnf-editor.component";
import {FnfEditorOptionsClass} from "../common/editor/data/fnf-editor-options.class";


@Component({
  selector: 'app-servershell-out',
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FnfEditorComponent,
  ],
  template: `
    <app-fnf-editor
        [(text)]="displayText"
        [options]="editorOptions"
        class="fnf-editor"></app-fnf-editor>
  `,
  styles: [`
      :host {
          display: block;
          width: 100%;
          height: 100%;

          .fnf-editor {
              width: 100%;
              height: 100%;
          }
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServershellOutComponent {

  @Input() displayText: string = '';

  editorOptions = new FnfEditorOptionsClass({
    readOnly: true,
    theme: 'vs-dark',
    lineNumbers: 'on',
    minimap: false,
    wordWrap: 'on',
    language: 'shell'
  });


}

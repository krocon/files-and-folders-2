import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_BOTTOM_SHEET_DATA} from "@angular/material/bottom-sheet";
import {FnfEditorComponent} from "../../../common/editor/fnf-editor.component";
import {FnfEditorOptionsClass} from "../../../common/editor/data/fnf-editor-options.class";


@Component({
  selector: 'app-shell-out',
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
export class ShellOutComponent {
  displayText: string = '';
  editorOptions = new FnfEditorOptionsClass({
    readOnly: true,
    theme: 'vs-dark',
    lineNumbers: 'on',
    minimap: false,
    wordWrap: 'on',
    language: 'shell'
  });

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public text: { text: string }
  ) {
    console.info('ShellOutComponent: data', text);
    this.displayText = text?.text || '';
  }
}

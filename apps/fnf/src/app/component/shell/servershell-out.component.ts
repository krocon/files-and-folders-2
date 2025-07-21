import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, ViewChild} from '@angular/core';
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
        #editor
        [text]="displayText"
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

  @ViewChild('editor', {static: false}) editor!: FnfEditorComponent;


  get displayText(): string {
    return this._displayText;
  }

  @Input()
  set displayText(value: string) {
    this._displayText = value;
    this.cdr.detectChanges();
    this.scrollDown();
  }

  private _displayText: string = '';

  scrollDown() {
    if (this.editor) {
      this.ngZone.runOutsideAngular(() => {
        // Small delay to ensure the text has been updated in the editor
        setTimeout(() => {
          this.editor.scrollToBottom();
        }, 10);
      });
    }
  }

  editorOptions = new FnfEditorOptionsClass({
    readOnly: true,
    theme: 'vs',
    lineNumbers: 'off',
    minimap: false,
    wordWrap: 'off',
    language: 'shell'
  });

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {
  }

}

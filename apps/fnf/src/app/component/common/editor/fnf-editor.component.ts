import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FnfEditorOptions} from './data/fnf-editor-options.interface';
import {FnfEditorOptionsClass} from './data/fnf-editor-options.class';
// import {window} from "rxjs";

declare const monaco: any;

@Component({
  selector: 'app-fnf-editor',
  template: `
    <div
        #editorContainer
        style="width: 100%; height: 100%; min-height: 200px;"></div>
  `,
  styles: [`
      :host {
          display: block;
          width: 100%;
          height: 100%;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FnfEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', {static: true}) editorContainer!: ElementRef<HTMLDivElement>;
  @Output() textChange = new EventEmitter<string>();
  @Input() options: FnfEditorOptions = new FnfEditorOptionsClass();
  @Output() optionsChange = new EventEmitter<FnfEditorOptions>();

  private editor: any = null;
  private monacoLoaded = false;
  private isInitialized = false;

  constructor(
    private readonly ngZone: NgZone
  ) {
  }

  private _text: string = '';

  get text(): string {
    return this._text;
  }

  @Input()
  set text(value: string) {
    this._text = value;

    this.updateText(value);
  }

  ngOnInit(): void {
    this.loadMonacoEditor();
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  // Method to update editor options
  updateOptions(newOptions: Partial<FnfEditorOptions>): void {
    if (!this.editor) return;

    const updatedOptions = {...this.options, ...newOptions};
    this.options = updatedOptions;
    this.optionsChange.emit(updatedOptions);

    this.ngZone.runOutsideAngular(() => {
      this.editor.updateOptions({
        theme: updatedOptions.theme,
        lineNumbers: updatedOptions.lineNumbers,
        minimap: {enabled: updatedOptions.minimap},
        wordWrap: updatedOptions.wordWrap,
        readOnly: updatedOptions.readOnly || false,
      });

      if (updatedOptions.theme) {
        monaco.editor.setTheme(updatedOptions.theme);
      }
    });
  }

  // Method to update editor text programmatically
  updateText(newText: string): void {
    if (!this.editor) return;

    this.ngZone.runOutsideAngular(() => {
      if (this.editor.getValue() !== newText) {
        this.editor.setValue(newText);
      }
    });
  }

  // Method to get current editor value
  getValue(): string {
    return this.editor ? this.editor.getValue() : this._text;
  }

  // Method to focus the editor
  focus(): void {
    if (this.editor) {
      this.ngZone.runOutsideAngular(() => {
        this.editor.focus();
      });
    }
  }

  // Method to scroll to the bottom of the editor
  scrollToBottom(): void {
    if (this.editor) {
      this.ngZone.runOutsideAngular(() => {
        const lineCount = this.editor.getModel().getLineCount();
        this.editor.revealLine(lineCount);
        this.editor.setPosition({lineNumber: lineCount, column: 1});
      });
    }
  }

  private loadMonacoEditor(): void {
    if (typeof monaco !== 'undefined') {
      this.monacoLoaded = true;
      this.initializeEditor();
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      if (typeof (window as any).require === 'undefined') {
        // Load Monaco loader script
        const script = document.createElement('script');
        script.src = '/assets/monaco/min/vs/loader.js';
        script.onload = () => {
          this.configureAndLoadMonaco();
        };
        document.head.appendChild(script);
      } else {
        this.configureAndLoadMonaco();
      }
    });
  }

  private configureAndLoadMonaco(): void {
    this.ngZone.runOutsideAngular(() => {
      (window as any).require.config({paths: {vs: location.origin + '/assets/monaco/min/vs'}});
      (window as any).require(['vs/editor/editor.main'], () => {
        this.monacoLoaded = true;
        this.ngZone.run(() => {
          this.initializeEditor();
        });
      });
    });
  }

  private initializeEditor(): void {
    if (!this.monacoLoaded || this.isInitialized || !this.editorContainer) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const editorOptions = {
        value: this._text,
        language: this.options.language || 'plaintext',
        theme: this.options.theme,
        automaticLayout: this.options.automaticLayout !== false,
        lineNumbers: this.options.lineNumbers,
        minimap: {enabled: this.options.minimap},
        wordWrap: this.options.wordWrap,
        readOnly: this.options.readOnly || false,
      };

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, editorOptions);

      // Set up change listener
      this.editor.onDidChangeModelContent(() => {
        const newValue = this.editor.getValue();
        this.ngZone.run(() => {
          this._text = newValue;
          this.textChange.emit(newValue);
        });
      });

      this.isInitialized = true;
    });
  }

  private destroyEditor(): void {
    if (this.editor) {
      this.ngZone.runOutsideAngular(() => {
        this.editor.dispose();
        this.editor = null;
      });
    }
    this.isInitialized = false;
  }
}

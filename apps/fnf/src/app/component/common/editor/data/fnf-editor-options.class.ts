import {FnfEditorOptions} from './fnf-editor-options.interface';

export class FnfEditorOptionsClass implements FnfEditorOptions {
  theme: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light' = 'vs-dark';
  lineNumbers: 'on' | 'off' = 'on';
  minimap: boolean = true;
  wordWrap: 'on' | 'off' = 'off';
  language?: string = 'plaintext';
  readOnly?: boolean = false;
  automaticLayout?: boolean = true;

  constructor(options?: Partial<FnfEditorOptions>) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
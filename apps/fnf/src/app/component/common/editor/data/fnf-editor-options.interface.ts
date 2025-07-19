export interface FnfEditorOptions {
  theme: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
  lineNumbers: 'on' | 'off';
  minimap: boolean;
  wordWrap: 'on' | 'off';
  language?: string;
  readOnly?: boolean;
  automaticLayout?: boolean;
}
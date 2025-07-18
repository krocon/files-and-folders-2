import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {FileItemIf} from "@fnf/fnf-data";
import {EditService} from "../../service/edit.service";
import {fixPath} from "../../common/fn/path-2-dir-base.fn";
import {MatButton} from "@angular/material/button";

// TODO 2 buttons:  close, save
@Component({
  selector: "fnf-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ['edit.component.css'],
  imports: [
    FormsModule,
    EditorComponent,
    MatButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  /*

  editorOptions = {
    language: 'json',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineHeight: 20,
    fontSize: 14,
    wordWrap: 'on',
    wrappingIndent: 'indent',
};

   */

  text: string = 'Loading...';

  fileItem: FileItemIf | null = null;
  name = '';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly editService: EditService,
    private readonly elementRef: ElementRef
  ) {
  }


  ngOnInit(): void {
    let item = localStorage.getItem('edit-selected-data');
    if (item) {
      this.fileItem = JSON.parse(item) as FileItemIf;
      this.name = fixPath(this.fileItem.dir + '/' + this.fileItem.base);

      this.editorOptions.language = this.getMonacoLanguageFromFileSuffix(this.fileItem.ext);

      this.editService
        .loadFile(this.name)
        .subscribe(
          s => {
            this.text = s;
            this.cdr.detectChanges();
          }
        );
    }
  }

  private getVSCodeProperties(element: Element): Array<[string, string]> {
    const computedStyle = getComputedStyle(element);
    let map: Array<[string, string]> = Array.from(computedStyle)
      .filter(prop => {
        const value = computedStyle.getPropertyValue(prop);
        return prop.startsWith('--vscode')
          && (value.startsWith('rgb') || value.startsWith('#'));
      })
      .map(prop => [prop, computedStyle.getPropertyValue(prop)]);
    return map;
  }


  save() {
    if (!this.fileItem) return; // skip

    let name = fixPath(this.fileItem.dir + '/' + this.fileItem.base);
    this.editService
      .saveFile(name, this.text)
      .subscribe(
        s => {
          this.text = s;
          this.cdr.detectChanges();
        }
      );
  }

  /**
   * Returns the appropriate Monaco Editor language identifier for a given file extension
   * @param fileSuffix The file extension including the dot (e.g., '.json', '.ts')
   * @returns The corresponding Monaco Editor language identifier or 'plaintext' if not found
   */
  getMonacoLanguageFromFileSuffix(fileSuffix: string): string {
    // Normalize the file suffix by ensuring it starts with a dot and converting to lowercase
    const normalizedSuffix = fileSuffix.startsWith('.')
      ? fileSuffix.toLowerCase()
      : `.${fileSuffix.toLowerCase()}`;

    // Map of file extensions to Monaco Editor language identifiers
    const extensionToLanguageMap: Record<string, string> = {
      // Common web languages
      '.html': 'html',
      '.htm': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.less': 'less',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.json': 'json',
      '.jsonc': 'json',
      '.xml': 'xml',
      '.svg': 'xml',

      // Markdown and documentation
      '.md': 'markdown',
      '.markdown': 'markdown',
      '.txt': 'plaintext',

      // Backend languages
      '.java': 'java',
      '.py': 'python',
      '.rb': 'ruby',
      '.php': 'php',
      '.cs': 'csharp',
      '.cpp': 'cpp',
      '.c': 'c',
      '.h': 'cpp',
      '.hpp': 'cpp',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',

      // Configuration files
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.toml': 'toml',
      '.ini': 'ini',
      '.config': 'xml',
      '.properties': 'properties',

      // Shell scripts
      '.sh': 'shell',
      '.bash': 'shell',
      '.zsh': 'shell',
      '.ps1': 'powershell',
      '.bat': 'bat',
      '.cmd': 'bat',

      // Database
      '.sql': 'sql',

      // Other
      '.docker': 'dockerfile',
      '.dockerfile': 'dockerfile',
      '.graphql': 'graphql',
      '.gql': 'graphql',
    };

    // Return the mapped language or 'plaintext' if no mapping exists
    return extensionToLanguageMap[normalizedSuffix] || 'plaintext';
  }

  onInit(evt: any) {
    const editorElement = this.elementRef.nativeElement.querySelector('.monaco-editor');
    if (editorElement) {
      const properties = this.getVSCodeProperties(editorElement);

      // const buf: string[] = [];
      // properties.forEach(([prop, value]) => {
      //   buf.push(`${prop}: ${value};`);
      // })
      // console.info(buf.sort().join('\n'));

      properties.forEach(([prop, value]) => {
        this.elementRef.nativeElement.style.setProperty(prop, value);
      });
    }
  }
}

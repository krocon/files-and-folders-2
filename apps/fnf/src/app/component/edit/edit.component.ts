import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {FileItemIf} from "@fnf/fnf-data";
import {EditService} from "../../service/edit.service";
import {fixPath} from "../../common/fn/path-2-dir-base.fn";

// TODO 2 buttons:  close, save
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
export class EditComponent implements OnInit, AfterViewInit {

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
      console.info('editorOptions.language', this.editorOptions.language); // TODO
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

  ngAfterViewInit() {
    // Wait for Monaco editor to initialize
    setTimeout(() => {
      const editorElement = this.elementRef.nativeElement.querySelector('.monaco-editor');
      console.info('editorElement', editorElement)
      if (editorElement) {
        const computedStyle = getComputedStyle(editorElement);

        const background = computedStyle.getPropertyValue('--vscode-editor-background');
        const foreground = computedStyle.getPropertyValue('--vscode-editor-foreground');
        console.info('background', background);
        this.elementRef.nativeElement.style.setProperty('--vscode-editor-background', background);
        this.elementRef.nativeElement.style.setProperty('--vscode-editor-foreground', foreground);
      }
    }, 100);
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

}

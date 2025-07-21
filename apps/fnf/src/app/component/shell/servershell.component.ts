import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {debounceTime, takeWhile} from "rxjs/operators";
import {Router} from "@angular/router";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatInput, MatPrefix, MatSuffix} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ServershellHistoryService} from "./service/servershell-history.service";
import {ServershellService} from "./service/servershell.service";
import {Observable, Subject} from "rxjs";
import {MatTooltip} from "@angular/material/tooltip";
import {ServershellOutComponent} from "./servershell-out.component";
import {AppService} from "../../app.service";
import {ServershellAutocompleteService} from "./service/servershell-autocomplete.service";
import {ShellSpawnResultIf} from "@fnf/fnf-data";

@Component({
  selector: "fnf-servershell",
  templateUrl: "./servershell.component.html",
  styleUrls: ["./servershell.component.css"],
  imports: [
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatOption,
    MatPrefix,
    MatSuffix,
    ReactiveFormsModule,
    ServershellOutComponent,
    FormsModule,
    MatTooltip,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServershellComponent implements OnInit, OnDestroy {

  @Input() path = "/Users/marckronberg/WebstormProjects/files-and-folders-2/test";
  @Input() text = "ls -al";
  @Output() focusChanged = new EventEmitter<boolean>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  hasFocus = false;
  errorMsg = '';
  filteredCommands: string[] = [];

  displayText = '';

  private readonly textChange$ = new Subject<string>();
  private alive = true;
  private historyIndex = -1;
  private currentHistory: string[] = [];
  private readonly rid = Math.random().toString(36).substring(2, 15);
  private command = '';
  private ignoreNewText = false;

  private readonly dynamicCommands = [
    "top",
    "htop",
    "watch",
    "less",
    "man",
    "tail -f",
    "dstat",
    "iotop",
    "nmon",
    "glances",
    "bmon",
    "iftop",
    "iptraf",
    "nethogs",
    "tig",
    "alsamixer",
    "cmus",
    "mpv --vo=curses",
    "vim",
    "nano",
    "tmux",
    "screen"
  ];

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly shellHistoryService: ServershellHistoryService,
    private readonly shellService: ServershellService,
    private readonly shellAutocompleteService: ServershellAutocompleteService,
    private readonly appService: AppService,
  ) {
  }

  ngOnInit(): void {
    this.path = this.appService.getActiveTabOnActivePanel().path;
    this.currentHistory = this.shellHistoryService.getHistory();
    this.initAutocomplete();
  }

  /**
   * Handle selection of an autocomplete option
   * @param command The selected option
   */
  onOptionSelected(command: string): void {
    this.text = command;
    this.cdr.detectChanges();
  }

  /**
   * Handle keyboard events for history navigation and ESC
   */
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.onOkClicked();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory(-1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory(1);
        break;
      case 'Escape':
        event.preventDefault();
        this.text = '';
        this.historyIndex = -1;
        this.cdr.detectChanges();
        break;
    }
  }

  onOkClicked() {
    // Close the autocomplete popup if it's open
    if (this.autocompleteTrigger && this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    }

    this.errorMsg = '';
    this.command = '';
    this.cdr.detectChanges();
    if (!this.text || this.text.trim().length === 0) return; // skip

    const command = this.text.trim();

    if (command === 'clear' || command === 'cls') {
      this.displayText = '';
      this.ignoreNewText = true;
      this.sendCancel();
      this.cdr.detectChanges();
      return;
    }
    if (command === 'quit' || command === 'q' || command === 'bye' || command === 'exit') {
      this.displayText = '';
      this.cdr.detectChanges();
      this.sendCancel();
      this.navigateToFiles();
      return;
    }
    this.ignoreNewText = false;
    this.command = command;

    // Add to history
    this.shellHistoryService.addHistory(command);
    this.currentHistory = this.shellHistoryService.getHistory();
    this.historyIndex = -1;

    // Generate keys for this request
    const emitKey = `ServerShell${this.rid}`;
    const cancelKey = `cancelServerShell${this.rid}`;

    // Execute shell command
    this.shellService.doSpawn({
        cmd: command,
        emitKey: emitKey,
        cancelKey: cancelKey,
        timeout: 60000 // 60 seconds timeout
      },
      (result: ShellSpawnResultIf) => {

        if (result.emitKey !== emitKey) return;// skip
        if (this.ignoreNewText) return; // skip

        // Handle the result from shell execution
        if (result.out && !result.done) {
          // Check if text starts with control characters (like cursor jump back)
          // Common control characters: \r (carriage return), \x1b (escape), \x08 (backspace)
          const hasControlCharsAtStart = /^[\r\x1b\x08\x0c\x07]/.test(result.out);
          const isDynamicCommand = this.dynamicCommands.some(c => command.startsWith(c));

          if (hasControlCharsAtStart || isDynamicCommand) {
            // Replace the entire text
            this.displayText = this.getOutTextPrefix() + result.out;
          } else {
            // Normal text - append:
            this.displayText = this.displayText + this.getOutTextPrefix() + result.out;
          }
        }

        if (result.error) {
          this.errorMsg = result.error;
        }

        this.cdr.detectChanges();
      }
    );

    // Clear the input
    this.text = '';
    this.cdr.detectChanges();
  }

  onFocusIn() {
    this.hasFocus = true;
    this.focusChanged.emit(true);
  }

  onFocusOut() {
    this.hasFocus = false;
    this.focusChanged.emit(false);
  }

  onTextChange() {
    this.errorMsg = '';
    this.textChange$.next(this.text);
  }

  ngOnDestroy(): void {
    this.sendCancel();

    this.alive = false;
    this.textChange$.complete();
  }

  navigateToFiles(): void {
    this.router.navigate(['/files']);
  }

  private sendCancel() {
    const cancelKey = `cancelServerShell${this.rid}`;
    this.shellService.doCancelSpawn(cancelKey);
  }


  private getOutTextPrefix(): string {
    return '\n' + this.path + '>' + this.command + '\n';
  }


  private navigateHistory(direction: number): void {
    if (this.currentHistory.length === 0) return;

    const newIndex = this.historyIndex + direction;

    if (newIndex >= -1 && newIndex < this.currentHistory.length) {
      this.historyIndex = newIndex;

      if (this.historyIndex === -1) {
        this.text = '';
      } else {
        this.text = this.currentHistory[this.currentHistory.length - 1 - this.historyIndex];
      }

      this.cdr.detectChanges();
    }
  }

  private initAutocomplete(): void {
    // Set up the textChange$ observable with debounce
    this.textChange$
      .pipe(
        debounceTime(500), // 500ms debounce time
        takeWhile(() => this.alive),
      )
      .subscribe(_s => {
        if (this.text && this.text.trim().length > 0) {
          this.filterCommands(this.text)
            .pipe(
              takeWhile(() => this.alive)
            )
            .subscribe(commands => {
              //this.filteredCommands$.next(commands);
              this.filteredCommands = commands;
              this.cdr.detectChanges();
            });
        } else {
          // this.filteredCommands$.next([]);
          this.filteredCommands = [];
          this.cdr.detectChanges();
        }
      });
  }

  private filterCommands(input: string): Observable<string[]> {
    return this.shellAutocompleteService.getAutocompleteSuggestions(input);
  }

}

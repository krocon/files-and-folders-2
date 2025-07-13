import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatPrefix, MatSuffix} from "@angular/material/input";
import {ShellService} from "../../../../service/shell.service";
import {MatBottomSheet, MatBottomSheetConfig} from "@angular/material/bottom-sheet";
import {ShellOutComponent} from "./shell-out.component";
import {ShellHistoryService} from "./shell-history.service";
import {ShellAutocompleteService} from "../../../../service/shell-autocomplete.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


/**
 * TODO pfeil hoch, runter: history, esc-> clear ,
 */
@Component({
  selector: 'app-shell-panel',
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatPrefix,
    MatSuffix,
    MatAutocompleteModule,
  ],
  templateUrl: './shell-panel.component.html',
  styleUrl: './shell-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellPanelComponent implements OnDestroy {

  private readonly destroy$ = new Subject<void>();

  @Input() path = "";
  @Input() text = "ls -al";

  @Output() focusChanged = new EventEmitter<boolean>();

  hasFocus = false;
  errorMsg = '';
  filteredCommands$ = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly shellService: ShellService,
    private readonly shellAutocompleteService: ShellAutocompleteService,
    private readonly cdr: ChangeDetectorRef,
    private readonly matBottomSheet: MatBottomSheet,
    private readonly shellHistoryService: ShellHistoryService,
  ) {
    // Initialize the autocomplete functionality
    this.initAutocomplete();
  }

  /**
   * Initialize the autocomplete functionality
   */
  private initAutocomplete(): void {
    // We'll set up the filteredCommands$ observable in the onTextChange method
  }

  /**
   * Filter commands based on user input
   * @param input The current input text
   * @returns Observable of filtered commands
   */
  private filterCommands(input: string): Observable<string[]> {
    return this.shellAutocompleteService.getAutocompleteSuggestions(input);
  }

  /**
   * Handle selection of an autocomplete option
   * @param command The selected option
   */
  onOptionSelected(command: string): void {
    this.text = command;
    this.cdr.detectChanges();
  }

  onOkClicked() {
    this.errorMsg = '';
    this.cdr.detectChanges();
    if (!this.text || this.text.trim().length === 0) return; // skip

    this.shellService
      .shell([
        {
          path: this.path,
          cmd: this.text,
          para: ''
        }
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const res0 = res[0];
        // TODO ausgabe und error anzeigen
        console.info('onOkClicked RES:', res);
        console.info('\n');
        console.info(res0.stdout);


        if (!res0.stderr && !res0.error) {
          this.shellHistoryService.addHistory(this.text);
          this.text = '';
          this.openShellOutput(res0.stdout ?? '');

        } else {
          this.errorMsg = res0.stderr ?? res0.error ?? '';
          this.errorMsg = this.errorMsg
            .replace(/\n/g, ' ')
            .replace(/<br>/g, ' ');
        }
        this.cdr.detectChanges();
      });
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

    // Get autocomplete suggestions based on current input
    if (this.text && this.text.trim().length > 0) {
      this.filterCommands(this.text)
        .pipe(takeUntil(this.destroy$))
        .subscribe(commands => {
          this.filteredCommands$.next(commands);
        });
    } else {
      this.filteredCommands$.next([]);
    }

    this.cdr.detectChanges();
  }

  openShellOutput(text: string) {
    if (!text) return; // skip

    const config = new MatBottomSheetConfig();
    config.panelClass = 'fnf-shell-panel-dialog';
    config.data = text;
    config.height = 'calc(100vh - 200px)';
    // config.width = 'calc(100vw - 200px)';
    this.matBottomSheet.open(ShellOutComponent, config);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.filteredCommands$.complete();
  }
}

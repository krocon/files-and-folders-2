import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
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

  hasFocus = false;
  errorMsg = '';
  filteredCommands: string[] = [];

  displayText = '';

  private readonly textChange$ = new Subject<string>();
  private alive = true;

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

  onOkClicked() {
    this.errorMsg = '';
    this.cdr.detectChanges();
    if (!this.text || this.text.trim().length === 0) return; // skip

    // generate     const emitKey = `ServerShell${this.rid}`;
    //     const cancelKey = `cancelServerShell${this.rid}`;

    // lsten to websocket emitKey
    // TODO send /spawn via service
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

    // Emit the current text value to the textChange$ Subject
    // The debounced subscription in initAutocomplete will handle the API call
    this.textChange$.next(this.text);
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.textChange$.complete();
    // send cancelKey
  }

  navigateToFiles(): void {
    this.router.navigate(['/files']);
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
          console.info('initAutocomplete text:', this.text);
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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatPrefix, MatSuffix} from "@angular/material/input";
import {ShellService} from "../../../../service/shell.service";


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
  ],
  templateUrl: './shell-panel.component.html',
  styleUrl: './shell-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellPanelComponent {

  @Input() path = "";
  @Input() text = "ls -al";

  @Output() focusChanged = new EventEmitter<boolean>();

  hasFocus = false;
  errorMsg = '';

  constructor(
    private readonly shellService: ShellService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    // nothing
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
      .subscribe(res => {
        const res0 = res[0];
        // TODO ausgabe und error anzeigen
        console.info('onOkClicked RES:', res);
        console.info('\n');

        console.info(res0.stdout);

        if (!res0.stderr && !res0.error) {
          this.text = '';

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
    this.cdr.detectChanges();
  }
}

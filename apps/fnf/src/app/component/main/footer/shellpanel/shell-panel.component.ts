import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {ShellService} from "../../../../service/shell.service";

@Component({
  selector: 'app-shell-panel',
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './shell-panel.component.html',
  styleUrl: './shell-panel.component.css'
})
export class ShellPanelComponent {

  @Input() path = "";
  @Input() text = "ls -al";

  @Output() focusChanged = new EventEmitter<boolean>();

  hasFocus = false;

  constructor(
    private readonly shellService: ShellService
  ) {
    // nothing
  }

  onOkClicked() {
    console.log('onOkClicked', this.text, this.path);
    this.shellService
      .shell([
        {
          path: this.path,
          cmd: this.text,
          para: ''
        }
      ])
      .subscribe(res => {
        console.info('onOkClicked RES:', res);
        console.info('\n');
        console.info(res[0].stdout);
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
}

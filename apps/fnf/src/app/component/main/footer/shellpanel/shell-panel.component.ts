import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";

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

  @Input() path = "c:\\test\\data";
  @Input() text = "";

  @Output() focusChanged = new EventEmitter<boolean>();

  hasFocus = false;

  onOkClicked() {

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

import {Component, Input} from '@angular/core';
import {PanelIndex} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {SelectionEvent} from "../../../../domain/filepagedata/data/selection-event";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-shell-panel',
  imports: [
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './shell-panel.html',
  styleUrl: './shell-panel.css'
})
export class ShellPanel {

  @Input() selectionEvent: SelectionEvent = new SelectionEvent();
  @Input() panelIndex: PanelIndex = 0;
  @Input() selected = false;

}

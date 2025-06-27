import {Component, Input} from '@angular/core';
import {PanelIndex} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {SelectionEvent} from "../../../../domain/filepagedata/data/selection-event";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-summary-label',
  imports: [
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './summary-label.html',
  styleUrl: './summary-label.css'
})
export class SummaryLabel {

  @Input() selectionEvent: SelectionEvent = new SelectionEvent();
  @Input() panelIndex: PanelIndex = 0;
  @Input() selected = false;

}

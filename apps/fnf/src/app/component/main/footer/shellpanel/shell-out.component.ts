import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_BOTTOM_SHEET_DATA} from "@angular/material/bottom-sheet";


@Component({
  selector: 'app-shell-out',
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: '<textarea>{{text}}</textarea>',
  styles: [`
      textarea {
          border: 0;
      }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellOutComponent {


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public text: { text: string }
  ) {
    console.info('ShellOutComponent: data', text);
  }


}

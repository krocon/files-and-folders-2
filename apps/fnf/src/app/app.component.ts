import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";


@Component({
  selector: 'fnf-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  template: '<router-outlet style="width: 100vw;height: 100vh"></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}

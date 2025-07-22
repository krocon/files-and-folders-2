import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {MatIconRegistry} from "@angular/material/icon";
import {environment} from "../environments/environment";
import {AppService} from "./app.service";


@Component({
  selector: 'fnf-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  template: `
    <router-outlet style="width: 100vw;height: 100vh"></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  initialized = false;

  constructor(
    private readonly matIconReg: MatIconRegistry,
    private readonly appService: AppService
  ) {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');

    const sorting = JSON.stringify([{"columnIndex": 0, "sortState": "asc"}]);
    localStorage.setItem('fnf-file-table-0-sortingState', sorting);
    localStorage.setItem('fnf-file-table-1-sortingState', sorting);

    console.info('        > Build Version:', environment.version);
  }

  ngOnInit(): void {
    this.appService.init(() => {
      this.initialized = true;
      console.info('        > App initialized');
    });
  }
}

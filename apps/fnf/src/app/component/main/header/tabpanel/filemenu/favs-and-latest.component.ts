import {Component, Input, ViewChild} from "@angular/core";
import {ChangeDirEvent} from "../../../../../service/change-dir-event";
import {PanelIndex} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

import {DockerRootDeletePipe} from "./docker-root-delete.pipe";
import {MatListItem} from "@angular/material/list";
import {AppService} from "../../../../../app.service";
import {FnfAutofocusDirective} from "../../../../../common/fnf-autofocus.directive";


@Component({
  selector: "fnf-fav-menu",
  templateUrl: "./favs-and-latest.component.html",
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    DockerRootDeletePipe,
    MatListItem,
    FnfAutofocusDirective,
  ]
})
export class FavsAndLatestComponent {
  @Input() panelIndex: PanelIndex = 0;
  @Input() dockerRoot: string = '/';
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger?: MatMenuTrigger;

  constructor(
    private readonly appService: AppService
  ) {
  }

  private _winDrives: string[] = [];

  get winDrives(): string[] {
    return this._winDrives;
  }

  @Input() set winDrives(value: string[]) {
    this._winDrives = value;
    this.filterDoubles();
  }

  private _favs: string[] = [];

  get favs(): string[] {
    return this._favs;
  }

  @Input() set favs(value: string[]) {
    this._favs = value;
    this.filterDoubles();
  }

  private _latest: string[] = [];

  get latest(): string[] {
    return this._latest;
  }

  @Input() set latest(value: string[]) {
    this._latest = value;
    this.filterDoubles();
  }

  public openMenu(open: boolean) {
    if (open) {
      this.clickHoverMenuTrigger?.openMenu();
    } else {
      this.clickHoverMenuTrigger?.closeMenu();
    }
  }

  onItemClicked(path: string) {
    this.appService.changeDir(new ChangeDirEvent(this.panelIndex, path));
  }

  private filterDoubles() {
    this._favs = this._favs.filter((v, i, a) => a.indexOf(v) === i && this._winDrives.indexOf(v) === -1);
    this._latest = this._latest.filter((v, i, a) => a.indexOf(v) === i && this._winDrives.indexOf(v) === -1 && this._favs.indexOf(v) === -1);
  }

}

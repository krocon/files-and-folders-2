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
  @Input() winDrives: string[] = [];
  @Input() favs: string[] = [];
  @Input() latest: string[] = [];
  @Input() dockerRoot: string = '/';

  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger?: MatMenuTrigger;

  constructor(
    private readonly appService: AppService
  ) {
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

}

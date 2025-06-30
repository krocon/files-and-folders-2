import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {AppService} from "../../../app.service";
import {takeWhile} from "rxjs/operators";


@Component({
  selector: "fnf-select-folder-dropdown",
  templateUrl: "./select-folder-dropdown.component.html",
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFolderDropdownComponent implements OnInit, OnDestroy {

  @Output() onSelected = new EventEmitter<string>();

  folders: string[] = [];

  private alive = true;

  private favs: string[] = [];
  private latest: string[] = [];
  private allHistories: string[] = [];


  constructor(
    private readonly appService: AppService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.appService
      .getAllHistories$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(arr => {
        this.allHistories = arr;
        this.mergeDirs();
      });

    this.appService
      .favs$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(favs => {
        this.favs = favs;
        this.mergeDirs();
      });

    this.appService
      .latest$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(latest => {
        this.latest = latest;
        this.mergeDirs();
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onItemClicked(ft: string) {
    this.onSelected.emit(ft);
  }

  private mergeDirs() {
    this.folders = [...new Set([...this.favs, ...this.latest, ...this.allHistories])].sort();
    this.cdr.detectChanges();
  }

}

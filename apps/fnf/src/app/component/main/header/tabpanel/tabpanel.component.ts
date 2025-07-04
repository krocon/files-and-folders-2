import {Component, EventEmitter, inject, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PanelIndex, Sysinfo, SysinfoIf} from "@fnf/fnf-data";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";
import {TabComponent} from "./tab/tab.component";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {FavsAndLatestComponent} from "./filemenu/favs-and-latest.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {AppService} from "../../../../app.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ActionShortcutPipe} from "../../../../common/action-shortcut.pipe";
import {takeWhile} from "rxjs/operators";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-tabpanel',
  imports: [
    CommonModule,
    TabComponent,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    FavsAndLatestComponent,
    MatButton,
    MatInput,
    FormsModule,
    MatTooltipModule,
    ActionShortcutPipe,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './tabpanel.component.html',
  styleUrl: './tabpanel.component.css'
})
export class TabpanelComponent implements OnInit, OnDestroy {

  // @Input() filterText: string = '';

  @Input() panelIndex: PanelIndex = 0;
  @Input() selected = false;
  @Input() winDrives: string[] = [];
  @Input() dockerRoot: string = '';
  @Input() latest: string[] = [];
  @Input() favs: string[] = [];
  @Input() sysinfo: SysinfoIf = new Sysinfo();


  @Output() readonly dataChanged = new EventEmitter<TabsPanelData>();
  // @Output() readonly filterChanged = new EventEmitter<TabsPanelData>();
  filterVisible: boolean = false;
  @ViewChild('favMenu') private readonly favMenu!: FavsAndLatestComponent;

  private readonly appService = inject(AppService);
  private readonly injector = inject(Injector);
  private alive = true;

  private _tabsPanelData?: TabsPanelData;


  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;
  }

  ngOnInit(): void {
    this.appService.actionEvents$
      .pipe(takeWhile(() => this.alive))
      .subscribe(action => {
        if (action === 'SELECT_LEFT_PANEL') {
          this.appService.setPanelActive(0);
          this.openMenu(this.panelIndex === 1);
          this.openMenu(this.panelIndex === 0);

        } else if (action === 'SELECT_RIGHT_PANEL') {
          this.appService.setPanelActive(1);
          this.openMenu(this.panelIndex === 1);
          this.openMenu(this.panelIndex === 0);
        }
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onSelectedIndexChanged(n: number) {
    if (this.tabsPanelData && n > -1) {
      this.tabsPanelData!.selectedTabIndex = n;
      this.dataChanged.next(this.tabsPanelData);
    }
  }


  onAddTabClicked($event: MouseEvent) {
    if (this.tabsPanelData) {
      const selectedTabData = this.tabsPanelData.tabs[this.tabsPanelData?.selectedTabIndex ?? 0];
      this.tabsPanelData.tabs.push(this.clone(selectedTabData));
      this.tabsPanelData.selectedTabIndex = this.tabsPanelData.tabs.length - 1;
      this.dataChanged.next(this.tabsPanelData);
    }
  }

  onRemoveTabClicked($event: MouseEvent) {
    if (this.tabsPanelData) {
      if (this.tabsPanelData.tabs.length > 1) {
        this.tabsPanelData.tabs.splice(this.tabsPanelData.selectedTabIndex, 1);
        const selectedTabData = this.tabsPanelData.tabs[this.tabsPanelData?.selectedTabIndex ?? 0];
        this.filterVisible = selectedTabData?.filterActive;
        if (this.tabsPanelData.selectedTabIndex > 0) {
          this.tabsPanelData.selectedTabIndex--;
        }
        this.dataChanged.next(this.tabsPanelData);
      }
    }
  }

  toggleFilterInput() {
    if (this.tabsPanelData) {
      const selectedTabData = this.tabsPanelData.tabs[this.tabsPanelData.selectedTabIndex];
      selectedTabData.filterActive = !selectedTabData.filterActive;
      this.dataChanged.next(this.tabsPanelData);
    }
  }
  toggleHiddenFilesVisible() {
    if (this.tabsPanelData) {
      const selectedTabData = this.tabsPanelData.tabs[this.tabsPanelData.selectedTabIndex];
      selectedTabData.hiddenFilesVisible = !selectedTabData.hiddenFilesVisible;
      this.dataChanged.next(this.tabsPanelData);
    }
  }

  onFilterChangedByUser() {
    if (this.tabsPanelData) this.dataChanged.next(this.tabsPanelData);
  }

  openMenu(open: boolean) {
    this.favMenu?.openMenu(open);
  }

  clearFilter() {
    if (this.tabsPanelData) {
      this.tabsPanelData.tabs[this.tabsPanelData.selectedTabIndex].filterText = '';
      this.dataChanged.next(this.tabsPanelData);
    }
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  onTabClicked(i: number, evt: MouseEvent, matMenuTrigger: MatMenuTrigger) {
    if (evt.button === 2) {
      evt.preventDefault();
      matMenuTrigger.openMenu();

    } else if (evt.shiftKey) {
      this.try2RemoveTab(i, evt);
    }
  }

  onTabPointerDown(i: number, evt: PointerEvent, matMenuTrigger: MatMenuTrigger) {
    this.onTabClicked(i, evt, matMenuTrigger);
  }
  
  private try2RemoveTab(i: number, evt: MouseEvent) {
      evt.preventDefault();

      if (this.tabsPanelData) {
        if (this.tabsPanelData.tabs.length > 1) {
          this.tabsPanelData.tabs.splice(i, 1);
          if (this.tabsPanelData.selectedTabIndex > 0) {
            this.tabsPanelData.selectedTabIndex--;
          }
          this.dataChanged.next(this.tabsPanelData);
        }
      }
    }


}

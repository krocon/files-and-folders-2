import {
  Component,
  effect,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnInit,
  Output,
  runInInjectionContext,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PanelIndex} from "../../../../domain/panel-index";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";
import {TabComponent} from "./tab/tab.component";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {FavsAndLatestComponent} from "./filemenu/favs-and-latest.component";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {Sysinfo, SysinfoIf} from "@fnf/fnf-data";
import {FormsModule} from "@angular/forms";
import {AppService} from "../../../../app.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ActionShortcutPipe} from "../../../../common/action-shortcut.pipe";

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
  ],
  templateUrl: './tabpanel.component.html',
  styleUrl: './tabpanel.component.css'
})
export class TabpanelComponent implements OnInit {

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

  private _tabsPanelData?: TabsPanelData;

  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;
  }

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const action = this.appService.actionEvents();
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
    });
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
}

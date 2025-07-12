import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PanelIndex, Sysinfo, SysinfoIf} from "@fnf/fnf-data";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";
import {TabComponent} from "./tab/tab.component";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatTabGroup, MatTabsModule} from "@angular/material/tabs";
import {FavsAndLatestComponent} from "./filemenu/favs-and-latest.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {AppService} from "../../../../app.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ActionShortcutPipe} from "../../../../common/action-shortcut.pipe";
import {takeWhile} from "rxjs/operators";
import {MatDivider} from "@angular/material/divider";
import {FnfAutofocusDirective} from "../../../../common/directive/fnf-autofocus.directive";

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
    FnfAutofocusDirective,
  ],
  templateUrl: './tabpanel.component.html',
  styleUrl: './tabpanel.component.css'
})
export class TabpanelComponent implements OnInit, OnDestroy, AfterViewInit {


  @Input() panelIndex: PanelIndex = 0;
  @Input() selected = false;
  @Input() winDrives: string[] = [];
  @Input() dockerRoot: string = '';
  @Input() latest: string[] = [];
  @Input() favs: string[] = [];
  @Input() sysinfo: SysinfoIf = new Sysinfo();


  @Output() readonly dataChanged = new EventEmitter<TabsPanelData>();

  filterVisible: boolean = false;
  @ViewChild('favMenu') private readonly favMenu!: FavsAndLatestComponent;
  @ViewChild(MatTabGroup) private tabGroup!: MatTabGroup;

  private readonly appService = inject(AppService);
  private readonly ngZone = inject(NgZone);

  private alive = true;
  private resizeObserver: ResizeObserver | null = null;

  private _tabsPanelData?: TabsPanelData;


  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;
  }


  ngOnInit(): void {
    this.appService
      .actionEvents$
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

  ngAfterViewInit(): void {
    // Set up ResizeObserver to detect when the component is resized
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => {
          this.ensureActiveTabVisible();
        });
      });

      if (this.tabGroup && this.tabGroup._elementRef && this.tabGroup._elementRef.nativeElement) {
        this.resizeObserver.observe(this.tabGroup._elementRef.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;

    // Clean up the ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  onSelectedIndexChanged(n: number) {
    if (this.tabsPanelData && n > -1) {
      this.tabsPanelData!.selectedTabIndex = n;
      this.dataChanged.next(this.tabsPanelData);
      // Ensure the newly selected tab is visible
      this.ensureActiveTabVisible();
    }
  }

  onAddTabClicked($event: MouseEvent) {
    if (this.tabsPanelData) {
      const selectedTabData = this.tabsPanelData.tabs[this.tabsPanelData?.selectedTabIndex ?? 0];
      this.tabsPanelData.tabs.push(this.clone(selectedTabData));
      this.tabsPanelData.selectedTabIndex = this.tabsPanelData.tabs.length - 1;
      this.dataChanged.next(this.tabsPanelData);
      // Ensure the newly added tab is visible
      this.ensureActiveTabVisible();
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
        // Ensure the active tab is visible after removing a tab
        this.ensureActiveTabVisible();
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

  onTabClicked(i: number, evt: MouseEvent, matMenuTrigger: MatMenuTrigger) {
    if (evt.button === 2) {
      //
    } else if (evt.shiftKey) {
      this.try2RemoveTab(i, evt);
    }
  }

  onTabDblClicked(i: number) {
    if (this.tabsPanelData) {
      this.appService.triggerAction(this.panelIndex ? 'RELOAD_DIR_1' : 'RELOAD_DIR_0');
    }
  }

  onTabPointerDown(i: number, evt: PointerEvent, matMenuTrigger: MatMenuTrigger) {
    this.onTabClicked(i, evt, matMenuTrigger);
  }

  onTabContextMenu(i: number, evt: MouseEvent, matMenuTrigger: MatMenuTrigger) {
    evt.preventDefault();
    matMenuTrigger.openMenu();
  }

  onLongPress(i: number, evt: MouseEvent | TouchEvent, matMenuTrigger: MatMenuTrigger) {
    evt.preventDefault();
    matMenuTrigger.openMenu();
  }

  onTabCloseClicked(i: number) {
    if (this.tabsPanelData) {
      if (this.tabsPanelData.tabs.length > 1) {
        this.tabsPanelData.tabs.splice(i, 1);
        if (this.tabsPanelData.selectedTabIndex > 0) {
          this.tabsPanelData.selectedTabIndex--;
        }
        this.dataChanged.next(this.tabsPanelData);
        // Ensure the active tab is visible after closing a tab
        this.ensureActiveTabVisible();
      }
    }
  }

  onTabMoveLeftClicked(i: number) {
    if (this.tabsPanelData && i > 0) {
      const temp = this.tabsPanelData.tabs[i];
      this.tabsPanelData.tabs[i] = this.tabsPanelData.tabs[i - 1];
      this.tabsPanelData.tabs[i - 1] = temp;
      this.tabsPanelData.selectedTabIndex = i - 1;
      this.dataChanged.next(this.tabsPanelData);
      // Ensure the active tab is visible after moving it
      this.ensureActiveTabVisible();
    }
  }

  onTabMoveRightClicked(i: number) {
    if (this.tabsPanelData && i < this.tabsPanelData.tabs.length - 1) {
      const temp = this.tabsPanelData.tabs[i];
      this.tabsPanelData.tabs[i] = this.tabsPanelData.tabs[i + 1];
      this.tabsPanelData.tabs[i + 1] = temp;
      this.tabsPanelData.selectedTabIndex = i + 1;
      this.dataChanged.next(this.tabsPanelData);
      // Ensure the active tab is visible after moving it
      this.ensureActiveTabVisible();
    }
  }

  onTabCloneClicked(i: number) {
    if (!this.tabsPanelData) return; // skip

    const clone = this.clone(this.tabsPanelData.tabs[i]);
    const targetPanelIndex = this.panelIndex === 0 ? 1 : 0;
    this.appService.addTab(targetPanelIndex, clone);
  }

  onTabMoveToOtherPanelClicked(i: number) {
    if (!this.tabsPanelData) return; // skip

    const clone = this.clone(this.tabsPanelData.tabs[i]);
    const targetPanelIndex = this.panelIndex === 0 ? 1 : 0;
    this.appService.addTab(targetPanelIndex, clone);
    this.onTabCloseClicked(i);
    // Note: onTabCloseClicked already calls ensureActiveTabVisible
  }

  onHistoryClicked(dir: string) {
    this.appService.onChangeDir(dir, this.panelIndex)
  }

  /**
   * Ensures that the active tab is visible in the viewport
   * This is called after resizing, adding tabs, or changing the selected tab
   */
  private ensureActiveTabVisible(): void {
    if (!this.tabGroup || !this.tabsPanelData) {
      return;
    }

    // Use setTimeout to ensure this runs after the view has been updated
    setTimeout(() => {
      // Find the tab header element
      const tabHeader = this.tabGroup._elementRef.nativeElement.querySelector('.mat-mdc-tab-header');
      if (!tabHeader) return;

      // Find the active tab
      const activeTabIndex = this.tabsPanelData?.selectedTabIndex || 0;
      const tabLabels = tabHeader.querySelectorAll('.mat-mdc-tab');
      if (!tabLabels || activeTabIndex >= tabLabels.length) return;

      const activeTab = tabLabels[activeTabIndex];
      if (!activeTab) return;

      // Check if the active tab is fully visible
      const tabHeaderRect = tabHeader.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();

      // If the active tab is not fully visible, scroll to it
      if (activeTabRect.left < tabHeaderRect.left || activeTabRect.right > tabHeaderRect.right) {
        // Use the Material tabs scrollTo method if available
        if (this.tabGroup._tabHeader && typeof this.tabGroup._tabHeader._scrollToLabel === 'function') {
          this.tabGroup._tabHeader._scrollToLabel(activeTabIndex);
        } else {
          // Fallback: manually scroll the tab into view
          activeTab.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
        }
      }
    });
  }

  private clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  private try2RemoveTab(i: number, evt: MouseEvent) {
    evt.preventDefault();
    this.onTabCloseClicked(i);
    // Note: onTabCloseClicked already calls ensureActiveTabVisible
  }
}

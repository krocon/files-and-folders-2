import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {ResizeConfig} from './service/splitpane/resize-config.interface';
import {SplitPaneMouseService} from './service/splitpane/split-pane-mouse.service';
import {WindowResizeService} from './service/splitpane/window-resize.service';
import {ButtonPanelComponent} from './component/main/footer/buttonpanel/buttonpanel.component';
import {environment} from "../environments/environment";
import {ButtonEnableStates, FileItemIf} from "@fnf-data";
import {AppService} from "./app.service";
import {FileTableComponent} from "./component/main/filetable/file-table.component";
import {CommonModule} from "@angular/common";
import {BreadcrumbComponent} from "./component/main/header/breadcrumb/breadcrumb.component";
import {TabpanelComponent} from "./component/main/header/tabpanel/tabpanel.component";
import {PanelIndex} from "@fnf/fnf-data";
import {PanelSelectionService} from "./domain/filepagedata/service/panel-selection.service";
import {SummaryLabel} from "./component/main/footer/summarylabel/summary-label";
import {TabsPanelData} from "./domain/filepagedata/data/tabs-panel.data";
import {SelectionEvent} from "./domain/filepagedata/data/selection-event";
import {ShellPanel} from "./component/main/footer/shellpanel/shell-panel";


const CONFIG: ResizeConfig = {
  DEFAULT_PANEL_WIDTH: '50%',
  DEBOUNCE_DELAY: 250
} as const;

@Component({
  selector: 'fnf-root',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    ButtonPanelComponent,
    FileTableComponent,
    BreadcrumbComponent,
    TabpanelComponent,
    SummaryLabel,
    ShellPanel
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  initialized = false;

  // Using signals directly from appService
  readonly winDrives = this.appService.winDrives;
  readonly sysinfo = this.appService.sysinfo;
  latest: string[] = this.appService.latest;
  favs: string[] = this.appService.favs;
  readonly dockerRoot = this.appService.dockerRoot;

  readonly panelIndices: PanelIndex[] = [0, 1];
  readonly activePanelIndex = computed(() => this.panelSelectionService.panelIndex());

  tabsPanelData: [TabsPanelData, TabsPanelData] = this.appService.tabsPanelDatas;
  selectionEvents: SelectionEvent[] = this.panelIndices
    .map(i => new SelectionEvent());
  buttonEnableStatesArr = [
    new ButtonEnableStates(),
    new ButtonEnableStates()
  ];
  shellVisible: boolean = this.appService.isShellVisible();

  @ViewChild('splitPaneMain') private readonly splitPaneMainRef!: ElementRef<HTMLDivElement>;
  @ViewChild('splitPaneLeft') private readonly splitPaneLeftRef!: ElementRef<HTMLDivElement>;

  private doCheckCount = 0;
  private idCounter = 0;


  constructor(
    private readonly renderer: Renderer2,
    private readonly splitPaneMouseService: SplitPaneMouseService,
    private readonly windowResizeService: WindowResizeService,
    private readonly appService: AppService,
    private readonly panelSelectionService: PanelSelectionService,
    private readonly cdr: ChangeDetectorRef,
    private readonly matIconReg: MatIconRegistry,
  ) {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }

  ngOnInit(): void {
    const sorting = JSON.stringify([{"columnIndex": 0, "sortState": "asc"}]);
    localStorage.setItem('fnf-file-table-0-sortingState', sorting);
    localStorage.setItem('fnf-file-table-1-sortingState', sorting);

    console.info('Files and Folders');
    console.info('        > Build Version:', environment.version);
    console.info('        > shellVisible_: ', this.shellVisible);

    this.appService.init(() => {
      this.initialized = true;
      console.info('        > App initialized');
      this.cdr.detectChanges();
    });

    this.appService
      .filePageDataChanges(0)
      .subscribe(fd => {
        this.normalizeFilePageData(fd);
        this.tabsPanelData[0] = {...fd};
        this.cdr.detectChanges();
      });
    this.appService
      .filePageDataChanges(1)
      .subscribe(fd => {
        this.normalizeFilePageData(fd);
        this.tabsPanelData[1] = {...fd};
        this.cdr.detectChanges();
      });

    this.appService
      .favs$()
      .subscribe(favs => {
        this.favs = favs;
        this.cdr.detectChanges();
      });

    this.appService
      .latest$()
      .subscribe(latest => {
        this.latest = latest;
        this.cdr.detectChanges();
      });

    this.appService
      .getVolumes$()
      .subscribe(volumes => {
        console.info('        > volumes: ', volumes.join(', '));
      });

    this.appService
      .shellVisibilityChanges$()
      .subscribe(shellVisible => {
        this.shellVisible = shellVisible;
        console.info('        > shellVisible: ', shellVisible);
        this.cdr.detectChanges();
      });
  }

  onSelectionChanged(selectionLabelData: SelectionEvent, panelIndex: PanelIndex) {
    this.selectionEvents[panelIndex] = selectionLabelData;
  }

  ngAfterViewInit(): void {
    this.windowResizeService.initialize(this.renderer, this.splitPaneMainRef, this.splitPaneLeftRef, CONFIG);
    this.initializePanels();
  }

  ngOnDestroy(): void {
    this.windowResizeService.cleanup();
  }

  ngDoCheck() {
    // debugging:
    this.doCheckCount++;
    document.title = '' + this.doCheckCount;
  }

  setActivePanel(panelIndex: PanelIndex): void {
    this.appService.setPanelActive(panelIndex);
  }

  onTabDataChanged(tabsPanelData: TabsPanelData, panelIndex: PanelIndex): void {
    if (this.tabsPanelData) {
      this.tabsPanelData[panelIndex] = tabsPanelData;
      this.updatePathes();
      this.appService.updateTabsPanelData(panelIndex, this.tabsPanelData[panelIndex]);
    }
  }

  onBreadcrumbClicked(item: FileItemIf, panelIndex: PanelIndex) {
    this.onChangeDir(item.dir, panelIndex);
  }

  onChangeDir(path: string, panelIndex: PanelIndex) {
    this.selectionEvents[panelIndex] = new SelectionEvent();
    this.appService.onChangeDir(path, panelIndex);
  }


  onKeyUp(keyboardEvent: KeyboardEvent) {
    this.appService.onKeyUp$.next(keyboardEvent);
  }

  onKeyDown(keyboardEvent: KeyboardEvent) {
    const actionByKeyEvent = this.appService.getActionByKeyEvent(keyboardEvent);
    if (actionByKeyEvent && actionByKeyEvent !== 'DO_NOTHING') {
      keyboardEvent.preventDefault();
      this.appService.triggerAction(actionByKeyEvent);
    }

    this.appService.onKeyDown$.next(keyboardEvent);
  }


  // ----------------------------------

  onButtonStatesChanged(states: ButtonEnableStates, number: number) {
    this.buttonEnableStatesArr[number] = states;
  }

  private updatePathes(): void {
    this.appService.model2local(0);
    this.appService.model2local(1);
  }

  private initializePanels(): void {
    if (!this.splitPaneMainRef) return;

    const splitDivs = this.splitPaneMainRef.nativeElement.querySelectorAll<HTMLDivElement>('.split-div');
    for (const splitDiv of Array.from(splitDivs)) {
      this.initializeSplitDiv(splitDiv);
    }
  }

  private initializeSplitDiv(splitDiv: HTMLDivElement): void {
    const separator = splitDiv.querySelector('.panel-separator') as HTMLDivElement;
    if (!separator) return;

    this.splitPaneMouseService.setupSeparatorEvents(
      splitDiv,
      separator,
      this.windowResizeService.setProperty.bind(this.windowResizeService)
    );
  }

  private normalizeFilePageData(tabsPanelData: TabsPanelData) {
    // Normalize paths in all tabs
    for (const tab of tabsPanelData.tabs) {
      tab.path = this.normalizePath(tab.path);
      tab.id = this.idCounter++;
    }
  }

  /**
   * Normalizes a file path by replacing backslashes with forward slashes
   * and removing double slashes.
   */
  private normalizePath(path: string): string {
    return path.replace(/\\/g, "/").replace(/\/\//g, "/");
  }
}

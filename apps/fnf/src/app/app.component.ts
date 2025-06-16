import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DoCheck,
  effect,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  runInInjectionContext,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
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
import {FileTableComponent} from "./component/main/content/filetable/file-table.component";
import {CommonModule} from "@angular/common";
import {FilePageData} from "./domain/filepagedata/data/file-page.data";
import {BreadcrumbComponent} from "./component/main/header/breadcrumb/breadcrumb.component";
import {TabpanelComponent} from "./component/main/header/tabpanel/tabpanel.component";
import {PanelIndex} from "./domain/panel-index";
import {PanelSelectionService} from "./domain/filepagedata/service/panel-selection.service";
import {SummaryLabel} from "./component/main/footer/summarylabel/summary-label";
import {TabsPanelData} from "./domain/filepagedata/data/tabs-panel.data";
import {SelectionEvent} from "./domain/filepagedata/data/selection-event";


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
    SummaryLabel
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
  readonly latest = this.appService.latest;
  readonly favs = this.appService.favs;
  readonly dockerRoot = this.appService.dockerRoot;

  counter = 0; // TODO do we relly need this?

  readonly panelIndices: PanelIndex[] = [0, 1];
  readonly activePanelIndex = computed(() => this.panelSelectionService.panelIndex());

  filePageData: FilePageData = this.appService.filePageData();
  selectionEvents: SelectionEvent[] = this.panelIndices
    .map(i => new SelectionEvent());
  buttonEnableStates = new ButtonEnableStates();

  @ViewChild('splitPaneMain') private readonly splitPaneMainRef!: ElementRef<HTMLDivElement>;
  @ViewChild('splitPaneLeft') private readonly splitPaneLeftRef!: ElementRef<HTMLDivElement>;

  private doCheckCount = 0;
  private alive = true;
  private injector = inject(Injector);
  private idCounter = 0;

  constructor(
    private readonly renderer: Renderer2,
    private readonly splitPaneMouseService: SplitPaneMouseService,
    private readonly windowResizeService: WindowResizeService,
    // business:
    private readonly appService: AppService,
    private readonly panelSelectionService: PanelSelectionService,
    //
    private readonly cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    console.info('Files and Folders');
    console.info('        > Build Version:', environment.version);

    this.appService.init(() => {
      this.initialized = true;
      console.info('        > App initialized');
      this.cdr.detectChanges();
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const fd = this.appService.filePageData();
        this.normalizeFilePageData(fd);
        this.filePageData = {...fd};
        this.cdr.detectChanges();
      });
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
    if (this.filePageData) {
      this.filePageData.tabRows[panelIndex] = tabsPanelData;
      this.updatePathes();
      this.appService.updateFilePageData(this.filePageData);
    }
  }

  onBreadcrumbClicked(item: FileItemIf, panelIndex: PanelIndex) {
    this.onChangeDir(item.dir, panelIndex);
  }

  onChangeDir(path: string, panelIndex: PanelIndex) {
    this.selectionEvents[panelIndex] = new SelectionEvent();
    this.appService.onChangeDir(path, panelIndex);
  }

  onKeydown(keyboardEvent: KeyboardEvent) {
    const actionByKeyEvent = this.appService.getActionByKeyEvent(keyboardEvent);
    if (actionByKeyEvent && actionByKeyEvent !== 'DO_NOTHING') {
      keyboardEvent.preventDefault();
      this.appService.triggerAction(actionByKeyEvent);
    }
  }


  // ----------------------------------

  onButtonStatesChanged(states: ButtonEnableStates, number: number) {
    this.buttonEnableStates = states;
  }

  private updatePathes(): void {
    this.appService.model2local(0);
    this.appService.model2local(1);
    this.counter = this.filePageData?.counter ?? 0;
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

  private normalizeFilePageData(fd: FilePageData) {
    // Normalize paths in all tabs
    for (const tabRow of fd.tabRows) {
      for (const tab of tabRow.tabs) {
        tab.path = this.normalizePath(tab.path);
        tab.id = this.idCounter++;
      }
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

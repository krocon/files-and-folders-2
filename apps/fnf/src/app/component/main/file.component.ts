import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {ResizeConfig} from '../../service/splitpane/resize-config.interface';
import {SplitPaneMouseService} from '../../service/splitpane/split-pane-mouse.service';
import {WindowResizeService} from '../../service/splitpane/window-resize.service';
import {ButtonPanelComponent} from './footer/buttonpanel/buttonpanel.component';

import {ButtonEnableStates, FileItemIf, Sysinfo, SysinfoIf} from "@fnf-data";
import {AppService} from "../../app.service";
import {FileTableComponent} from "./filetable/file-table.component";
import {CommonModule} from "@angular/common";
import {BreadcrumbComponent} from "./header/breadcrumb/breadcrumb.component";
import {TabpanelComponent} from "./header/tabpanel/tabpanel.component";
import {PanelIndex} from "@fnf/fnf-data";
import {PanelSelectionService} from "../../domain/filepagedata/service/panel-selection.service";
import {SummaryLabel} from "./footer/summarylabel/summary-label";
import {TabsPanelData} from "../../domain/filepagedata/data/tabs-panel.data";
import {SelectionEvent} from "../../domain/filepagedata/data/selection-event";
import {ShellPanelComponent} from "./footer/shellpanel/shell-panel.component";
import {takeWhile} from "rxjs/operators";


const CONFIG: ResizeConfig = {
  DEFAULT_PANEL_WIDTH: '50%',
  DEBOUNCE_DELAY: 250
} as const;

@Component({
  selector: 'fnf-files',
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
    ShellPanelComponent
  ],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  initialized = false;

  // Using signals directly from appService
  readonly winDrives = this.appService.winDrives;
  sysinfo: SysinfoIf = new Sysinfo();
  latest: string[] = this.appService.latest;
  favs: string[] = this.appService.favs;
  readonly dockerRoot = this.appService.dockerRoot;

  readonly panelIndices: PanelIndex[] = [0, 1];
  tabsPanelData: [TabsPanelData, TabsPanelData] = this.appService.tabsPanelDatas;

  activePanelIndex: PanelIndex = this.panelSelectionService.getValue();
  activeTabsPanelData: TabsPanelData = this.tabsPanelData[this.activePanelIndex];
  activePanelPath: string = '';


  selectionEvents: SelectionEvent[] = this.panelIndices
    .map(i => new SelectionEvent());
  buttonEnableStatesArr = [
    new ButtonEnableStates(),
    new ButtonEnableStates()
  ];
  shellVisible: boolean = this.appService.isShellVisible();
  shellInputHasFocus = false;
  @ViewChild('splitPaneMain') private readonly splitPaneMainRef!: ElementRef<HTMLDivElement>;
  @ViewChild('splitPaneLeft') private readonly splitPaneLeftRef!: ElementRef<HTMLDivElement>;
  private doCheckCount = 0;
  private idCounter = 0;

  private alive = true;

  constructor(
    private readonly renderer: Renderer2,
    private readonly splitPaneMouseService: SplitPaneMouseService,
    private readonly windowResizeService: WindowResizeService,
    private readonly appService: AppService,
    private readonly panelSelectionService: PanelSelectionService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.alive = true;

    this.appService
      .init$
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(
        () => {
          this.init();
        })
  }

  init() {
    this.initialized = true;
    this.cdr.detectChanges();

    this.panelSelectionService
      .valueChanges$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(panelIndex => {
        this.activePanelIndex = panelIndex;
        this.calcActiveData();
      })


    this.appService
      .filePageDataChanges(0)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(fd => {
        this.normalizeFilePageData(fd);
        this.tabsPanelData[0] = {...fd};
        if (this.activePanelIndex === 0) {
          this.calcActiveData();
        }
        this.cdr.detectChanges();
      });

    this.appService
      .filePageDataChanges(1)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(fd => {
        this.normalizeFilePageData(fd);
        this.tabsPanelData[1] = {...fd};
        if (this.activePanelIndex === 1) {
          this.calcActiveData();
        }
        this.cdr.detectChanges();
      });

    this.appService
      .favs$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(favs => {
        this.favs = favs;
        this.cdr.detectChanges();
      });

    this.appService
      .latest$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(latest => {
        this.latest = latest;
        this.cdr.detectChanges();
      });

    this.appService
      .getVolumes$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(volumes => {
        // TODO console.info('        > Volumes          :', volumes.join(', '));
      });

    this.appService
      .shellVisibilityChanges$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(shellVisible => {
        this.shellVisible = shellVisible;
        console.info('        > Shell Visible    : ', shellVisible);
        this.cdr.detectChanges();
      });

    this.appService
      .getSysinfo$()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(sysinfo => {
        this.sysinfo = sysinfo;
        this.cdr.detectChanges();
      });

  }

  setSelectionChanged(selectionLabelData: SelectionEvent, panelIndex: PanelIndex) {
    this.selectionEvents[panelIndex] = selectionLabelData;
  }

  ngAfterViewInit(): void {
    this.windowResizeService.initialize(this.renderer, this.splitPaneMainRef, this.splitPaneLeftRef, CONFIG);
    this.initializePanels();
  }

  ngOnDestroy(): void {
    this.windowResizeService.cleanup();
    this.alive = false;
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
    if (this.shellInputHasFocus || this.isInputElement(keyboardEvent)) return; // skip
    this.appService.onKeyUp$.next(keyboardEvent);
  }

  onKeyDown(keyboardEvent: KeyboardEvent) {
    if (this.shellInputHasFocus || this.isInputElement(keyboardEvent)) return; // skip

    const actionByKeyEvent = this.appService.getActionByKeyEvent(keyboardEvent);
    if (actionByKeyEvent && actionByKeyEvent !== 'DO_NOTHING') {
      keyboardEvent.preventDefault();
      this.appService.triggerAction(actionByKeyEvent);
    }

    this.appService.onKeyDown$.next(keyboardEvent);
  }

  setButtonStatesChanged(states: ButtonEnableStates, number: number) {
    this.buttonEnableStatesArr[number] = states;
  }


  // ----------------------------------

  onShellfocusChanged(hasFocus: boolean) {
    this.shellInputHasFocus = hasFocus;
  }

  private calcActiveData() {
    this.activeTabsPanelData = this.tabsPanelData[this.activePanelIndex];
    let tabData = this.activeTabsPanelData.tabs[this.activeTabsPanelData.selectedTabIndex];
    this.activePanelPath = tabData?.path ?? '';
  }

  private isInputElement(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
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

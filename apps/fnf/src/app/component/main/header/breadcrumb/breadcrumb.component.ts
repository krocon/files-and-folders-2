import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output} from '@angular/core';
import {FileItemIf, FindDialogData} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {path2FileItems} from "../../../../common/fn/path-to-file-items";
import {Subject} from "rxjs";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";
import {TabData} from "../../../../domain/filepagedata/data/tab.data";
import {MatTooltip} from "@angular/material/tooltip";
import {AppService} from "../../../../app.service";
import {FavToggleComponent} from "./fav.component";

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    MatTooltip,
    FavToggleComponent
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {


  @Output() pathClicked = new Subject<FileItemIf>();
  @Output() toggleFavClicked = new Subject<string>();

  fileItems: Array<FileItemIf> = [];
  fileItem: FileItemIf | undefined = undefined;
  pattern: string = '';
  tabDataItem?: TabData;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly appService: AppService,
  ) {
  }

  private _tabsPanelData?: TabsPanelData;

  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;

    this.fileItems = [];
    this.fileItem = undefined;
    this.pattern = '';

    if (this._tabsPanelData) {
      this.tabDataItem = this._tabsPanelData.tabs[this._tabsPanelData.selectedTabIndex];

      if (this.tabDataItem) {
        this.fileItems = path2FileItems(this.tabDataItem.path);
        this.fileItem = this.fileItems[this.fileItems.length - 1];
        this.pattern = this.tabDataItem.findData?.findDialogData?.pattern ?? '';
      }
    }
    this.cdr.detectChanges();
  }


  onPathClicked(item: FileItemIf) {
    this.pathClicked.next(item);
  }


  onSearchDblClicked() {
    if (this.tabDataItem?.findData?.findDialogData) {
      const findDialogData: FindDialogData = {
        ...new FindDialogData(this.tabDataItem.path, '', false, false),
        ...this.tabDataItem?.findData?.findDialogData,
        newtab: false
      };
      this.appService.openFindDialog(findDialogData);
    }
  }

  onFavClicked() {

  }
}

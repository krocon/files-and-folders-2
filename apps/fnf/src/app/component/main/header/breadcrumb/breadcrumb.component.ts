import {ChangeDetectionStrategy, Component, Input, OnInit, Output} from '@angular/core';
import {PanelIndex} from "../../../../domain/panel-index";
import {FileItemIf} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {path2FileItems} from "../../../../common/fn/path-to-file-items";
import {Subject} from "rxjs";
import {TabsPanelData} from "../../../../domain/filepagedata/data/tabs-panel.data";

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {

  @Input() panelIndex: PanelIndex = 0;
  @Output() pathClicked = new Subject<FileItemIf>();
  @Output() toggleFavClicked = new Subject<string>();
  fileItems: Array<FileItemIf> = [];

  constructor() {
  }

  private _tabsPanelData?: TabsPanelData;

  get tabsPanelData(): TabsPanelData | undefined {
    return this._tabsPanelData;
  }

  @Input() set tabsPanelData(value: TabsPanelData) {
    this._tabsPanelData = value;
    this.createFileItems();
  }

  ngOnInit() {
    // this.createFileItems();
  }

  onPathClicked(item: FileItemIf) {
    this.pathClicked.next(item);
  }

  private createFileItems() {
    if (this._tabsPanelData) {
      let tabDataItem = this._tabsPanelData.tabs[this._tabsPanelData.selectedTabIndex];
      this.fileItems = path2FileItems(tabDataItem.path);
    } else {
      this.fileItems = [];
    }
  }
}

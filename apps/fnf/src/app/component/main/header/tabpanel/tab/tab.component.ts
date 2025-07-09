import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileItemIf, PanelIndex} from "@fnf/fnf-data";
import {TabData} from "../../../../../domain/filepagedata/data/tab.data";
import {CommonModule} from "@angular/common";
import {path2FileItems} from "../../../../../common/fn/path-to-file-items";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {LongPressDirective} from "../../../../../common/directive/long-press.directive";
import {shortenString} from "../../../../../common/fn/shorten-string.fn";

@Component({
  selector: 'app-tab',
  imports: [
    CommonModule,
    MatIcon,
    MatTooltip,
    LongPressDirective
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {

  fileItems: Array<FileItemIf> = [];
  fileItem: FileItemIf | undefined = undefined;
  tabfind: boolean = false;
  pattern: string = '';

  @Input() panelIndex: PanelIndex = 0;
  @Input() activeAndSelected: boolean = false;

  @Output() onLongPress = new EventEmitter<MouseEvent | TouchEvent>();


  private _tab?: TabData;

  get tab(): TabData | undefined {
    return this._tab;
  }

  @Input() set tab(tabData: TabData) {
    this._tab = tabData;
    this.fileItems = path2FileItems(tabData.path);
    this.fileItem = this.fileItems[this.fileItems.length - 1];
    this.tabfind = this.fileItem?.base.startsWith('tabfind') ?? false;
    this.pattern = tabData.findData?.findDialogData?.pattern ?? '';
  }


  onLongPressFindTab(evt: MouseEvent | TouchEvent) {
    this.onLongPress.next(evt);
  }

  onLongPressNormalTab(evt: MouseEvent | TouchEvent) {
    this.onLongPress.next(evt);
  }

  shortenLabel(base: string) {
    return shortenString(base);
  }
}

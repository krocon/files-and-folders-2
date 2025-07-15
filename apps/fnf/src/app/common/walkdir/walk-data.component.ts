import {Component, Input} from '@angular/core';
import {WalkData} from '@fnf/fnf-data';
import {FnfFileSizePipe} from '../fnf-file-size.pipe';

@Component({
  selector: 'fnf-walk-data',
  standalone: true,
  imports: [FnfFileSizePipe],
  template: `
    @if (walkData.last) {
      @if (!hideWording) {
        @if (walkData.folderCount === 0) {
          Explicit:
        } @else {
          Implicit:
        }
      }
    } @else {
      Scanning...
    }

    <b>{{ walkData.fileCount }}</b> file{{ walkData.fileCount > 1 ? 's' : '' }}&nbsp;
    <span>(<b>{{ walkData.sizeSum | fnfFileSize }}</b>)</span>

    @if (hideFolderCount || walkData.folderCount === 0) {
      <!-- no folder -->
    } @else if (walkData.folderCount === 1) {
      and <b>one</b> folder
    } @else {
      and <b>{{ walkData.folderCount }}</b> folders
    }
  `
})
export class WalkDataComponent {
  @Input() walkData: WalkData = new WalkData(0, 0, 0, false);
  @Input() hideFolderCount: boolean = false;
  @Input() hideWording: boolean = false;
}

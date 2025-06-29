import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FileItemIf} from "@fnf/fnf-data";
import {CommonModule} from "@angular/common";
import {FavDataService} from "../../../../domain/filepagedata/service/fav-data.service";

@Component({
  selector: 'app-fav-toggle',
  imports: [
    CommonModule,
  ],
  template: `

    @if (fav) {
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fav-checked"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          (click)="onFavClicked()">
        <path d="m438-400 198-198-57-56-141 141-57-57-57 57 114 113ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
      </svg>

    } @else {
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fav-unchecked"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          (click)="onFavClicked()">
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
      </svg>
    }
  `,
  styles: `
      :host {
          display: flex;

          .fav-checked {
              fill: var(--fnf-header-link-selected-color);
          }
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavToggleComponent {

  fav: boolean = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly favDataService: FavDataService,
  ) {
  }

  private _fileItem: FileItemIf | undefined = undefined;

  get fileItem(): FileItemIf | undefined {
    return this._fileItem;
  }

  @Input()
  set fileItem(value: FileItemIf | undefined) {
    this._fileItem = value;
    this.applyFavFlag();
  }

  applyFavFlag() {
    this.fav = this._fileItem ? this.favDataService.isFav(this.getFileUrl()) : false;
  }

  onFavClicked() {
    this.fav = !this.fav;
    if (this._fileItem) {
      this.favDataService.toggleFav(this.getFileUrl());
    }
  }

  private getFileUrl() {
    return this._fileItem?.dir ?? '';
  }
}

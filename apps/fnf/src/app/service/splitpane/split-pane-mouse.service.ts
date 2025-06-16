import {Injectable, NgZone} from '@angular/core';
import {CssVariables} from './css-variables.enum';

@Injectable({
  providedIn: 'root'
})
export class SplitPaneMouseService {
  private isResizing = false;

  constructor(private readonly ngZone: NgZone) {
  }

  setupSeparatorEvents(
    splitDiv: HTMLDivElement,
    separator: HTMLDivElement,
    onPropertyChange: (property: CssVariables, value: string) => void
  ): void {
    this.setupMouseDownEvent(splitDiv, separator, onPropertyChange);
    this.setupDoubleClickEvent(separator, onPropertyChange);
  }

  private setupMouseDownEvent(
    splitDiv: HTMLDivElement,
    separator: HTMLDivElement,
    onPropertyChange: (property: CssVariables, value: string) => void
  ): void {
    this.ngZone.runOutsideAngular(() => {
      separator.addEventListener('mousedown', () => {
        this.isResizing = true;
        const preventSelection = (e: Event) => e.preventDefault();

        this.setupResizeListeners(splitDiv, preventSelection, onPropertyChange);
        splitDiv.classList.add('resizing');
        document.addEventListener('selectstart', preventSelection);
      });
    });
  }

  private setupResizeListeners(
    splitDiv: HTMLDivElement,
    preventSelection: (e: Event) => void,
    onPropertyChange: (property: CssVariables, value: string) => void
  ): void {
    const handleMouseMove = (e: MouseEvent) => this.handleMouseMove(e, onPropertyChange, splitDiv);
    const handleMouseUp = () => this.handleMouseUp(splitDiv, preventSelection, handleMouseMove);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, {once: true});
  }

  private setupDoubleClickEvent(
    separator: HTMLDivElement,
    onPropertyChange: (property: CssVariables, value: string) => void
  ): void {
    this.ngZone.runOutsideAngular(() => {
      separator.addEventListener('dblclick', () => {
        onPropertyChange(CssVariables.SPLIT_PANEL_LEFT_WIDTH, '50vW - 4px');
        onPropertyChange(CssVariables.SPLIT_PANEL_RIGHT_WIDTH, '50vW - 4px');
      });
    });
  }

  private handleMouseMove(
    e: MouseEvent,
    onPropertyChange: (property: CssVariables, value: string) => void,
    splitDiv: HTMLDivElement,
  ): void {
    if (!this.isResizing) return;
    const w = splitDiv.clientWidth;
    onPropertyChange(CssVariables.SPLIT_PANEL_LEFT_WIDTH, `${e.clientX - 4}px`);
    onPropertyChange(CssVariables.SPLIT_PANEL_RIGHT_WIDTH, `${(w - e.clientX - 4)}px`);
  }

  private handleMouseUp(
    splitDiv: HTMLDivElement,
    preventSelection: (e: Event) => void,
    mouseMoveHandler: (e: MouseEvent) => void
  ): void {
    this.isResizing = false;
    splitDiv.classList.remove('resizing');

    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('mousemove', mouseMoveHandler);
  }
}

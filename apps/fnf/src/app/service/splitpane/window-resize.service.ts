import {ElementRef, Injectable, NgZone, Renderer2} from '@angular/core';
import {CssVariables} from './css-variables.enum';
import {ResizeConfig} from './resize-config.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowResizeService {

  private splitPaneMainRef: ElementRef<HTMLDivElement> | null = null;
  private splitPaneLeftRef: ElementRef<HTMLDivElement> | null = null;
  private resizeListener: (() => void) | null = null;
  private config: ResizeConfig;
  private renderer: Renderer2 | undefined;

  constructor(private readonly ngZone: NgZone) {
    this.config = {
      DEFAULT_PANEL_WIDTH: '50%',
      DEBOUNCE_DELAY: 250
    } as const;
  }

  /**
   * Initialize the service with references to the main and left split divs
   */
  initialize(
    renderer: Renderer2,
    splitPaneMainRef: ElementRef<HTMLDivElement>,
    splitPaneLeftRef: ElementRef<HTMLDivElement>,
    config?: ResizeConfig
  ): void {
    this.renderer = renderer;
    this.splitPaneMainRef = splitPaneMainRef;
    this.splitPaneLeftRef = splitPaneLeftRef;

    if (config) {
      this.config = config;
    }
    this.ngZone.runOutsideAngular(() => {
      this.initializeResizeHandling();
    });
  }

  /**
   * Clean up changedir listeners when component is destroyed
   */
  cleanup(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  /**
   * Public method to set a CSS property on the main div
   * Can be used by external components
   */
  public setProperty(property: CssVariables, value: string): void {
    this.setMainDivProperty(property, value);
  }

  /**
   * Initialize resize changedir handling
   */
  private initializeResizeHandling(): void {
    const handleResize = this.createResizeHandler();
    this.resizeListener = handleResize;
    this.renderer?.listen('window', 'resize', handleResize);
    this.updateViewportWidth();
  }

  /**
   * Create a debounced resize handler
   */
  private createResizeHandler(): () => void {
    return this.debounce(() => {
      this.updateViewportWidth();
      this.adjustPanelOnSmallScreen();
    }, this.config.DEBOUNCE_DELAY);
  }

  /**
   * Update the viewport width CSS variable
   */
  private updateViewportWidth(): void {
    if (!this.splitPaneMainRef) return;

    this.setMainDivProperty(
      CssVariables.VIEWPORT_WIDTH,
      `${this.splitPaneMainRef.nativeElement.clientWidth}px`
    );
  }

  /**
   * Adjust panel width on small screens
   */
  private adjustPanelOnSmallScreen(): void {
    if (!this.splitPaneMainRef || !this.splitPaneLeftRef) return;

    if (window.innerWidth < this.splitPaneLeftRef.nativeElement.clientWidth) {
      this.setMainDivProperty(CssVariables.SPLIT_PANEL_LEFT_WIDTH, this.config.DEFAULT_PANEL_WIDTH);
    }
  }

  /**
   * Set a CSS property on the main div
   */
  private setMainDivProperty(property: CssVariables, value: string): void {
    if (!this.splitPaneMainRef) return;
    this.splitPaneMainRef.nativeElement.style.setProperty(property, value);
  }

  /**
   * Debounce function to limit the rate at which a function can fire
   */
  private debounce(func: () => void, wait: number): () => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(), wait);
    };
  }
}

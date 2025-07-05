import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from "@angular/core";

const BASE_TIMER_DELAY = 50;

@Directive({
  selector: "[fnfAutofocus]"
})
export class FnfAutofocusDirective implements AfterContentInit, OnChanges, OnDestroy {

  @Input()
  public fnfAutofocusDelay: number | string = BASE_TIMER_DELAY;

  private timeout?: any; // number;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly ngZone: NgZone) {
  }

  private _condition = false;

  @Input("fnfAutofocus")
  set condition(value: string | boolean) {
    this._condition = value === "true" || ('' + value) === "true";
  }

  public ngAfterContentInit(): void {
    if (this._condition) {
      this.startFocusWorkflow();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['timerDelay'] && typeof this.fnfAutofocusDelay !== "number") {
      if (isNaN((this.fnfAutofocusDelay = +this.fnfAutofocusDelay))) {
        this.fnfAutofocusDelay = BASE_TIMER_DELAY;
      }
    }
    if (this._condition) {
      this.startFocusWorkflow();
    } else {
      this.stopFocusWorkflow();
    }
  }

  public ngOnDestroy(): void {
    this.stopFocusWorkflow();
  }

  private startFocusWorkflow(): void {
    if (this.timeout) {
      return; // skip
    }
    this.ngZone.runOutsideAngular(() => {
      if (this._condition) {
        this.timeout = setTimeout(() => {
          this.timeout = undefined;
          this.elementRef.nativeElement.focus();
        }, this.fnfAutofocusDelay as number);
      }
    });
  }

  private stopFocusWorkflow(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = undefined;
  }
}

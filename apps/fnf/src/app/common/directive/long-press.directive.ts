import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  @Input() pressDuration: number = 500; // Default long press duration is 500ms
  @Output() longPress = new EventEmitter<MouseEvent | TouchEvent>();

  private pressTimer: any;
  private event: MouseEvent | TouchEvent = new MouseEvent('click');

  constructor() {
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPressStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.pressTimer = setTimeout(() => {
      this.event = event
      this.longPress.emit(this.event); // Emit event after long press duration
    }, this.pressDuration);
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onPressEnd(event: MouseEvent | TouchEvent) {
    clearTimeout(this.pressTimer); // Clear the timer if press is released before duration
  }

  @HostListener('mouseleave', ['$event'])
  onPressLeave(event: MouseEvent | TouchEvent) {
    clearTimeout(this.pressTimer); // Clear the timer if mouse leaves the area
  }
}
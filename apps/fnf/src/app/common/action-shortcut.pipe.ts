import {Pipe, PipeTransform} from "@angular/core";
import {ShortcutService} from "../service/shortcut.service";


@Pipe({name: "fnfShortcut", pure: false})
export class ActionShortcutPipe implements PipeTransform {

  private shortcutCache: { [key: string]: string } = {};
  private initialized = false;

  constructor(
    private readonly shortcutService: ShortcutService
  ) {
    // Initialize shortcuts when pipe is created
    this.initShortcuts();
  }

  transform(action: string): string {
    // If we have a cached value, return it immediately
    if (this.shortcutCache[action]) {
      return this.shortcutCache[action];
    }

    // If not initialized yet, trigger initialization and return empty string for now
    if (!this.initialized) {
      this.initShortcuts();
    }

    // Get shortcuts synchronously
    const shortcutsByAction: string[] = this.shortcutService.getShortcutsByAction(action);

    // Cache and return the result
    if (shortcutsByAction && shortcutsByAction.length > 0) {
      this.shortcutCache[action] = shortcutsByAction[0];
      return shortcutsByAction[0];
    }

    this.shortcutCache[action] = '';
    return '';
  }

  private initShortcuts(): void {
    // Only initialize once
    if (this.initialized) return;

    // Check if shortcuts need to be loaded
    if (Object.keys(this.shortcutService['activeShortcuts']).length === 0) {
      this.shortcutService
        .init()
        .then(() => {
          this.initialized = true;
          // Clear cache to force re-evaluation
          this.shortcutCache = {};
        })
        .catch(err => {
          console.error('Error initializing shortcuts:', err);
        });
    } else {
      this.initialized = true;
    }
  }

}

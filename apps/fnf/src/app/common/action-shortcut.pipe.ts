import {Pipe, PipeTransform} from "@angular/core";
import {ShortcutActionMapping, ShortcutService} from "../service/shortcut.service";


@Pipe({name: "fnfShortcut", pure: false})
export class ActionShortcutPipe implements PipeTransform {

  public static shortcutCache: ShortcutActionMapping = {};

  constructor(
    private readonly shortcutService: ShortcutService
  ) {
  }

  transform(action: string): string {
    // If we have a cached value, return it immediately
    if (ActionShortcutPipe.shortcutCache[action]) {
      return ActionShortcutPipe.shortcutCache[action];
    }

    // Get shortcuts synchronously
    const shortcutsByAction: string[] = this.shortcutService.getShortcutsByAction(action);

    // Cache and return the result
    if (shortcutsByAction && shortcutsByAction.length > 0) {
      ActionShortcutPipe.shortcutCache[action] = shortcutsByAction[0];
      return shortcutsByAction[0];
    }

    ActionShortcutPipe.shortcutCache[action] = '';
    return '';
  }


}

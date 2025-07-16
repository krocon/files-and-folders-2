import {Injectable} from "@angular/core";
import {ActionId, createHarmonizedShortcutByKeyboardEvent, harmonizeShortcut} from "@guiexpert/table";
import {HttpClient} from "@angular/common/http";
import {BrowserOsType} from "@fnf/fnf-data";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export type ShortcutActionMapping = { [key: string]: string };


@Injectable({
  providedIn: "root"
})
export class ShortcutService {

  private static readonly config = {
    getShortcutActionMappingUrl: "assets/config/shortcut/"
  };

  // Initialize with default shortcuts to ensure something is available before init() is called
  private activeShortcuts: ShortcutActionMapping = {};

  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(ShortcutService.config, config);
  }

  getShortcuts(sys: BrowserOsType): Observable<ShortcutActionMapping | undefined> {
    return this.fetchShortcutMappings(sys)
      .pipe(
        tap(shortcutMappings => {
          if (shortcutMappings) {
            this.activeShortcuts = this.updateShortcutMappings(shortcutMappings);
          }
        })
      );
  }

  createHarmonizedShortcutByKeyboardEvent(keyboardEvent: KeyboardEvent): string {
    return createHarmonizedShortcutByKeyboardEvent(keyboardEvent)
      .split(' ')
      .filter(s => s)
      .filter((s, i, arr) => arr.indexOf(s) === i)
      .join(' ');
  }

  getActionByKeyEvent(keyboardEvent: KeyboardEvent): ActionId {
    const shortcut = this.createHarmonizedShortcutByKeyboardEvent(keyboardEvent);

    // Look up the action in activeShortcuts
    let action = this.activeShortcuts[shortcut] as ActionId;
    return action ?? 'DO_NOTHING';
  }

  getShortcutsByAction(action: string): string[] {
    const ret: string[] = [];
    for (const sc in this.activeShortcuts) {
      const a = this.activeShortcuts[sc];
      if (a === action) {
        ret.push(harmonizeShortcut(sc));
      }
    }
    return ret;
  }

  getFirstShortcutByActionAsTokens(action: string): string[] {
    for (const sc in this.activeShortcuts) {
      const a = this.activeShortcuts[sc];
      if (a === action) {
        return this.getShortcutAsLabelTokens(sc);
      }
    }
    return [];
  }

  getShortcutAsLabelTokens(sc:string):string[] {
    const hs = harmonizeShortcut(sc);
    return hs
      .replace('num_', 'num ')
      .split(' ')
      .map(s => s
        .replace(/ctrl/g, '^')
        .replace(/shift/g, '⇧')
        .replace(/cmd/g, '⌘')
        .replace(/add/g, '+')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/subtract/g, '-')
        .replace(/multiply/g, '*')
        .replace(/minus/g, '-')
      );
  }

  getActiveShortcuts(): ShortcutActionMapping {
    return this.activeShortcuts;
  }

  private fetchShortcutMappings(sys: BrowserOsType): Observable<ShortcutActionMapping | undefined> {
    return this.httpClient.get<ShortcutActionMapping>(ShortcutService.config.getShortcutActionMappingUrl + sys + '.json');
  }

  public addAdditionalShortcutMappings(map: ShortcutActionMapping): void {
    Object.entries(map).forEach(([key, value]) => {
      if (this.activeShortcuts[harmonizeShortcut(key)]){
        console.warn('Shortcut already exists:' + harmonizeShortcut(key));
        console.warn(this.activeShortcuts[harmonizeShortcut(key)], value);
        // throw new Error(
        //   'Shortcut already exists:' + harmonizeShortcut(key) +
        //   ' - ' + this.activeShortcuts[harmonizeShortcut(key)] +
        //   ' - ' + value
        // )
      }
      this.activeShortcuts[harmonizeShortcut(key)] = value;
    });
  }


  private updateShortcutMappings(fetchedMappings: ShortcutActionMapping): ShortcutActionMapping {
    const updatedMappings: ShortcutActionMapping = {...this.activeShortcuts};

    Object.entries(fetchedMappings).forEach(([key, value]) => {
      updatedMappings[harmonizeShortcut(key)] = value;
    });

    return updatedMappings;
  }

}

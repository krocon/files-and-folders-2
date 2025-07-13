import {Injectable} from '@angular/core';
import {TypedDataService} from "../../../../common/typed-data.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShellHistoryService {

  public static readonly MAX_HISTORY_LENGTH = 20;
  private readonly innerService = new TypedDataService<string[]>("shell-history", []);

  constructor() {
  }


  getHistory(): string[] {
    return this.innerService.getValue();
  }

  addHistory(item: string) {
    const history = this.getHistory();
    history.push(item);
    while (history.length > ShellHistoryService.MAX_HISTORY_LENGTH) {
      history.shift();
    }
    this.innerService.update(history);
  }

  clear() {
    this.innerService.update([]);
  }

  valueChanges$(): BehaviorSubject<string[]> {
    return this.innerService.valueChanges$;
  }
}

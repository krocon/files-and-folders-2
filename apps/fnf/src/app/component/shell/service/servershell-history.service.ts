import {Injectable} from '@angular/core';

import {BehaviorSubject} from "rxjs";
import {TypedDataService} from "../../../common/typed-data.service";

@Injectable({
  providedIn: 'root'
})
export class ServershellHistoryService {

  public static readonly MAX_HISTORY_LENGTH = 20;
  private readonly innerService = new TypedDataService<string[]>("servershell-history", []);

  constructor() {
  }


  getHistory(): string[] {
    return this.innerService.getValue();
  }

  addHistory(item: string) {
    const history = this.getHistory();
    history.push(item);
    while (history.length > ServershellHistoryService.MAX_HISTORY_LENGTH) {
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

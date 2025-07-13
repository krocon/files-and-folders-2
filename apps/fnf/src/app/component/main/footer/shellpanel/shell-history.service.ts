import {Injectable} from '@angular/core';
import {TypedDataService} from "../../../../common/typed-data.service";

@Injectable({
  providedIn: 'root'
})
export class ShellHistoryService {

  private readonly innerService = new TypedDataService<string[]>("shell-history", []);


  constructor() {
  }


  getHistory(): string[] {
    return this.innerService.getValue();
  }

  addHistory(item: string) {
    const history = this.getHistory();
    history.push(item);
    while (history.length > 20) history.shift();
    this.innerService.update(history);
  }

  valueChanges$() {
    this.innerService.valueChanges$;
  }
}

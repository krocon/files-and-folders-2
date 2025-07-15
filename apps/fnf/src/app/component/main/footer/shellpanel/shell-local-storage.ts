import {Injectable} from "@angular/core";
import {TypedDataService} from "../../../../common/typed-data.service";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: "root"
})
export class ShellLocalStorage {


  private readonly innerService = new TypedDataService<boolean>("shellVisible", true);


  setShellVisible(visible: boolean = true) {
    console.log('ShellLocalStorage.setShellVisible', JSON.stringify(visible));
    this.innerService.update(visible);
  }

  isShellVisible(): boolean {
    return this.innerService.getValue();
  }

  valueChanges$(): BehaviorSubject<boolean> {
    return this.innerService.valueChanges$;
  }


}

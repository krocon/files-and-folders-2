import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {TypedDataService} from "../../../common/typed-data.service";


@Injectable({
  providedIn: "root"
})
export class LatestDataService {

  public static MAX_ITEM_COUNT = 10;

  private static readonly innerService =
    new TypedDataService<string[]>("latest", []);

  readonly innerService = LatestDataService.innerService;

  public valueChanges(): BehaviorSubject<string[]> {
    return this.innerService.valueChanges$;
  }

  public addLatest(item: string) {
    let arr = this.getValue();
    arr = [item, ...arr];
    if (arr.length > LatestDataService.MAX_ITEM_COUNT) {
      arr.length = LatestDataService.MAX_ITEM_COUNT;
    }
    this.innerService.update(arr);
  }

  public removeLatest(fav: string) {
    const idx = this.getValue().indexOf(fav);
    if (idx > -1) {
      const ret = this.getValue();
      ret.splice(idx, 1);
      this.innerService.update([...ret]);
    }
  }

  public update(o: string[]) {
    this.innerService.update([...o]);
  }

  public getValue(): string[] {
    if (this.innerService.getValue() === null) {
      this.innerService.update([]);
    }
    return this.innerService.getValue() as string[];
  }

}

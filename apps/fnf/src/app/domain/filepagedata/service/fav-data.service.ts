import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {TypedDataService} from "../../../common/typed-data.service";


@Injectable({
  providedIn: "root"
})
export class FavDataService {


  private static readonly innerService =
    new TypedDataService<string[]>("fav", []);

  readonly innerService = FavDataService.innerService;

  public valueChanges(): BehaviorSubject<string[]> {
    return this.innerService.valueChanges$;
  }

  public addFav(fav: string) {
    const favs = this.getValue();
    favs.push(fav);
    this.innerService.update([...favs]);
  }

  public removeFav(fav: string) {
    const idx = this.getValue().indexOf(fav);
    if (idx > -1) {
      const ret = this.getValue();
      ret.splice(idx, 1);
      this.innerService.update([...ret]);
    }
  }

  public toggleFav(fav: string) {
    const yet = this.isFav(fav);
    if (yet) {
      this.removeFav(fav);
    } else {
      this.addFav(fav);
    }
  }

  public isFav(fav: string): boolean {
    const idx = this.getValue().indexOf(fav);
    return (idx > -1);
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

import {Injectable} from "@angular/core";
import {ChangeDirEvent} from "./change-dir-event";
import {TypedEventService} from "../common/typed-event.service";


@Injectable({
  providedIn: "root"
})
export class ChangeDirEventService extends TypedEventService<ChangeDirEvent> {

  public static skipNextHistoryChange: boolean = false;

}

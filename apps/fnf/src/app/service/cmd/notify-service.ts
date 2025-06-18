import { Injectable } from '@angular/core';
import {TypedEventService} from "../../common/typed-event.service";
import {NotifyEventIf} from "../../domain/cmd/notify-event.if";

@Injectable({
  providedIn: 'root'
})
export class NotifyService extends TypedEventService<NotifyEventIf>{


}

import {Injectable} from '@angular/core';
import {TypedEventService} from "../../common/typed-event.service";
import {QueueNotifyEventIf} from "../../domain/cmd/queue-notify-event.if";

@Injectable({
  providedIn: 'root'
})
export class NotifyService extends TypedEventService<QueueNotifyEventIf>{


}

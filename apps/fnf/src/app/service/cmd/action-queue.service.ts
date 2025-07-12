import {Injectable} from '@angular/core';
import {QueueActionEvent} from '../../domain/cmd/queue-action-event';
import {QueueActionEventType} from '../../domain/cmd/queue-action-event.type';
import {QueueStatus} from '../../domain/cmd/queue-status';
import {Observable} from 'rxjs';
import {QueueProgress} from "../../domain/cmd/queue-progress";
import {QueueIf} from "../../domain/cmd/queue.if";
import {Queue} from "../../domain/cmd/queue";
import {FileActionService} from "./file-action.service";
import {DirEvent, OnDoResponseType} from "@fnf/fnf-data";
import {NotifyService} from "./notify-service";
import {QueueNotifyEvent} from "../../domain/cmd/queue-notify-event";

@Injectable({
  providedIn: 'root'
})
export class ActionQueueService {

  // Events
  public static readonly REFRESH_JOB_QUEUE_TABLE: QueueActionEventType = 'refresh_job_queue_table';
  public static readonly OPEN_JOB_QUEUE_TABLE: QueueActionEventType = 'open_job_queue_table';
  // QueueIf Status constants
  readonly QUEUE_STATUS_IDLE: QueueStatus = 'IDLE';
  readonly QUEUE_STATUS_RUNNING: QueueStatus = 'RUNNING';
  readonly QUEUE_STATUS_ERROR: QueueStatus = 'ERROR';
  // Action Status constants
  readonly ACTION_STATUS_NEW: QueueStatus = 'NEW';
  readonly ACTION_STATUS_PENDING: QueueStatus = 'PENDING';
  readonly ACTION_STATUS_PROCESSING: QueueStatus = 'PROCESSING';
  readonly ACTION_STATUS_ERROR: QueueStatus = 'ERROR';
  readonly ACTION_STATUS_WARNING: QueueStatus = 'WARNING';
  readonly ACTION_STATUS_SUCCESS: QueueStatus = 'SUCCESS';
  readonly ACTION_STATUS_ABORT: QueueStatus = 'ABORT';
  // Action Event Keys
  readonly ACTION_REFRESH_PANEL: QueueActionEventType = 'refresh_panel';
  readonly ACTION_MKDIR: QueueActionEventType = 'mkdir';
  readonly ACTION_OPEN: QueueActionEventType = 'open';
  readonly ACTION_COPY: QueueActionEventType = 'copy';
  readonly ACTION_MOVE: QueueActionEventType = 'move';
  readonly ACTION_REMOVE: QueueActionEventType = 'remove';
  readonly ACTION_DELEMPTY: QueueActionEventType = 'delempty';
  readonly ACTION_RENAME: QueueActionEventType = 'rename';
  private queues: QueueIf[] = [];
  private jobId = 0;
  private refreshQueueTableTimer: any;


  constructor(
    private readonly fileActionService: FileActionService,
    private readonly eventService: NotifyService
  ) {
  }

  /**
   * Gets a queue by index, creating a new one if necessary
   * @param queueIndex The index of the queue to get
   */
  getQueue(queueIndex: number = 0): QueueIf {
    if (queueIndex > this.queues.length) {
      throw new Error(`Error: getQueue(queueIndex) queueIndex is ${queueIndex} but queues.length is ${this.queues.length}!`);
    }
    if (queueIndex === this.queues.length) {
      // Auto add new queue:
      this.addNewQueue();
    }
    return this.queues[queueIndex];
  }


  getQueueStatus(queueIndex: number = 0): QueueStatus {
    return this.getQueue(queueIndex).status;
  }

  getQueues() {
    return this.queues;
  }


  getQueueProgress(queueIndex: number = 0): QueueProgress {
    return this.getQueue(queueIndex).progress;
  }


  /**
   * Adds multiple actions to a queue
   * @param actions The actions to add
   * @param queueIndex The index of the queue to add the actions to
   */
  addActions(actions: QueueActionEvent[], queueIndex: number = 0): void {
    this.jobId++;
    const queue = this.getQueue(queueIndex);
    queue.jobId = this.jobId;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      action.status = this.ACTION_STATUS_NEW;
      action.id = this.jobId;
      queue.actions.push(action);
    }
    this.triggerJobQueueTableUpdate();
    this.triggerProgress();
  }

  /**
   * Processes the next action in a queue
   * @param queue The queue to process
   */
  next(queue: QueueIf = this.getQueue(0)): void {
    if (queue.status==='PAUSED') return;

    for (let i = 0; i < queue.actions.length; i++) {
      const action: QueueActionEvent = queue.actions[i];
      if (action.status === this.ACTION_STATUS_NEW) {
        queue.status = this.QUEUE_STATUS_RUNNING;
        action.status = this.ACTION_STATUS_PROCESSING;

        if (action.action === this.ACTION_REFRESH_PANEL) {
          action.status = this.ACTION_STATUS_SUCCESS;

          this.eventService.next(
            new QueueNotifyEvent(
              this.ACTION_REFRESH_PANEL,
              [
                {...new DirEvent('', []), panelIndex: action.panelIndex}
              ]));
          this.triggerJobQueueTableUpdate();

        } else {
          // In the original code, this would use executorFactory to create an executor
          // Since we don't have a direct replacement, we'll simulate the behavior
          this.executeAction(action)
            .subscribe({
              next: (res: OnDoResponseType) => {

                queue.status = this.QUEUE_STATUS_IDLE;
                action.status = this.ACTION_STATUS_SUCCESS;

                this.eventService.next({
                  type: action.action,
                  data: res
                });
                this.next(queue);
                this.triggerJobQueueTableUpdate();
              },
              error: (err) => {
                queue.status = this.QUEUE_STATUS_ERROR;
                action.status = this.ACTION_STATUS_ERROR;
                this.triggerJobQueueTableUpdate();
              }
            });
          return; // leave the for loop
        }
      }
    }
    queue.status = this.QUEUE_STATUS_IDLE;
    this.triggerJobQueueTableUpdate();
  }

  /**
   * Gets an observable for a specific event type
   * @param eventType The type of event to listen for
   */
  onEvent(eventType: string): Observable<OnDoResponseType> {
    return new Observable<OnDoResponseType>((observer) => {
      const subscription =
        this.eventService
          .valueChanges()
          .subscribe((event) => {
            if (event && event.type === eventType) {
              observer.next(event.data);
            }
          });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  openJobTable() {
    this.eventService.next(new QueueNotifyEvent(ActionQueueService.OPEN_JOB_QUEUE_TABLE, []));
  }

  removeSuccessed(queueIndex: number = 0) {
    const queue = this.getQueue(queueIndex);
    queue.actions = queue.actions.filter(action => action.status != this.ACTION_STATUS_SUCCESS);
  }

  doStop(queueIndex: number = 0) {
    const queue = this.getQueue(queueIndex);
    queue.actions = queue.actions.filter(action => action.status != this.ACTION_STATUS_PROCESSING);
  }

  doPause(queueIndex: number = 0) {
    const queue = this.getQueue(queueIndex);
    queue.status = 'PAUSED';
  }

  isPause(queueIndex: number = 0) {
    return this.getQueue(queueIndex).status==='PAUSED';
  }

  doResume(queueIndex: number = 0) {
    const queue = this.getQueue(queueIndex);
    queue.status = 'IDLE';
    this.triggerProgress();
  }

  /**
   * Adds a new queue to the list of queues
   * @private
   */
  private addNewQueue(): void {
    this.queues.push(new Queue({
      status: this.QUEUE_STATUS_IDLE
    }));
  }

  /**
   * Calculates the progress of all queues
   * @private
   */
  private calcQueueProgress(): void {
    for (let queueIndex = 0; queueIndex < this.queues.length; queueIndex++) {
      const queue = this.queues[queueIndex];
      const progress = queue.progress;
      progress.unfinished = 0;
      progress.finished = 0;
      progress.errors = 0;

      const jid = queue.jobId;
      const actions = queue.actions;

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.id >= jid) {
          if (action.status === this.ACTION_STATUS_NEW ||
            action.status === this.ACTION_STATUS_PENDING ||
            action.status === this.ACTION_STATUS_PROCESSING) {
            progress.unfinished++;
          } else {
            progress.finished++;
          }
          if (action.status === this.ACTION_STATUS_ERROR) {
            progress.errors++;
          }
        }
      }

      if (progress.finished > 0 && progress.unfinished === 0) {
        progress.class = 'font-weight-bold text-success';
      } else if (progress.unfinished > 0) {
        progress.class = 'text-info';
      } else if (progress.errors) {
        progress.class = 'font-weight-bold text-danger';
      } else {
        progress.class = 'text-muted';
      }

      queue.buttonStates.clean = progress.finished >0;
      queue.buttonStates.pause = progress.unfinished>0;
      queue.buttonStates.resume = progress.unfinished>0 && queue.status==='PAUSED';
      queue.buttonStates.stop = queue.status==='RUNNING' ||  queue.status==='PROCESSING';
    }
  }


  private triggerJobQueueTableUpdate(): void {
    this.calcQueueProgress();
    if (this.refreshQueueTableTimer) {
      clearTimeout(this.refreshQueueTableTimer);
    }
    this.refreshQueueTableTimer = setTimeout(() => {
      this.eventService.next(new QueueNotifyEvent(ActionQueueService.REFRESH_JOB_QUEUE_TABLE, []));
    }, 500);
  }


  private triggerProgress(): void {
    this.calcQueueProgress();
    for (let i = 0; i < this.queues.length; i++) {
      const queue = this.queues[i];
      if (queue.status === this.QUEUE_STATUS_IDLE) {
        this.next(queue);
      }
    }
  }

  private executeAction(action: QueueActionEvent): Observable<OnDoResponseType> {
    return this.fileActionService.do(action.filePara);
  }

}

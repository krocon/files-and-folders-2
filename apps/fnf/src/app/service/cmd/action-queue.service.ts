import {Injectable} from '@angular/core';
import {ActionEvent} from '../../domain/cmd/action-event';
import {ActionEventType} from '../../domain/cmd/action-event.type';
import {QueueStatus} from '../../domain/cmd/queue-status';
import {TypedEventService} from '../../common/typed-event.service';
import {Observable} from 'rxjs';
import {QueueProgress} from "../../domain/cmd/queue.progress";
import {Queue} from "../../domain/cmd/queue";
import {FileActionService} from "./file-action.service";
import {DoEventIf} from "@fnf/fnf-data";

@Injectable({
  providedIn: 'root'
})
export class ActionQueueService {

  // Queue Status constants
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
  readonly ACTION_REFRESH_PANEL: ActionEventType = 'refresh_panel';
  readonly ACTION_MKDIR: ActionEventType = 'mkdir';
  readonly ACTION_COPY: ActionEventType = 'copy';
  readonly ACTION_MOVE: ActionEventType = 'move';
  readonly ACTION_REMOVE: ActionEventType = 'remove';
  readonly ACTION_DELEMPTY: ActionEventType = 'delempty';
  readonly ACTION_RENAME: ActionEventType = 'rename';

  // Events
  readonly REFRESH_JOB_QUEUE_TABLE: string = 'REFRESH_JOB_QUEUE_TABLE';

  private queues: Queue[] = [];
  private jobId = 0;
  private refreshQueueTableTimer: any;
  private eventService = new TypedEventService<any>();

  constructor(
    private readonly fileActionService: FileActionService
  ) {
  }

  /**
   * Gets a queue by index, creating a new one if necessary
   * @param queueIndex The index of the queue to get
   */
  getQueue(queueIndex: number = 0): Queue {
    if (queueIndex > this.queues.length) {
      throw new Error(`Error: getQueue(queueIndex) queueIndex is ${queueIndex} but queues.length is ${this.queues.length}!`);
    }
    if (queueIndex === this.queues.length) {
      // Auto add new queue:
      this.addNewQueue();
    }
    return this.queues[queueIndex];
  }

  /**
   * Gets the status of a queue
   * @param queueIndex The index of the queue
   */
  getQueueStatus(queueIndex: number = 0): QueueStatus {
    return this.getQueue(queueIndex).status;
  }

  /**
   * Gets the progress of a queue
   * @param queueIndex The index of the queue
   */
  getQueueProgress(queueIndex: number = 0): QueueProgress {
    return this.getQueue(queueIndex).progress;
  }

  /**
   * Adds an action to a queue
   * @param action The action to add
   * @param queueIndex The index of the queue to add the action to
   */
  addAction(action: ActionEvent, queueIndex: number = 0): void {
    const queue = this.getQueue(queueIndex);
    action.status = this.ACTION_STATUS_NEW;
    action.id = ++this.jobId;
    queue.actions.push(action);
    queue.jobId = this.jobId;
    this.triggerProgress();
  }

  /**
   * Adds multiple actions to a queue
   * @param actions The actions to add
   * @param queueIndex The index of the queue to add the actions to
   */
  addActions(actions: ActionEvent[], queueIndex: number = 0): void {
    this.jobId++;
    const queue = this.getQueue(queueIndex);
    queue.jobId = this.jobId;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      action.status = this.ACTION_STATUS_NEW;
      action.id = this.jobId;
      queue.actions.push(action);
    }
    this.triggerProgress();
  }

  /**
   * Processes the next action in a queue
   * @param queue The queue to process
   */
  next(queue: Queue = this.getQueue(0)): void {
    for (let i = 0; i < queue.actions.length; i++) {
      const action = queue.actions[i];
      if (action.status === this.ACTION_STATUS_NEW) {
        queue.status = this.QUEUE_STATUS_RUNNING;
        action.status = this.ACTION_STATUS_PROCESSING;

        if (action.action === this.ACTION_REFRESH_PANEL) {
          action.status = this.ACTION_STATUS_SUCCESS;
          this.eventService.next({
            type: this.ACTION_REFRESH_PANEL,
            data: {index: action.panelIndex}
          });
          this.triggerJobQueueTableUpdate();

        } else {
          // In the original code, this would use executorFactory to create an executor
          // Since we don't have a direct replacement, we'll simulate the behavior
          this.executeAction(action)
            .subscribe({
              next: (event) => {
                queue.status = this.QUEUE_STATUS_IDLE;
                action.status = this.ACTION_STATUS_SUCCESS;

                const events = [event]; // TODO ???
                if (!action.bulk && events) {
                  // fire update events:
                  for (let j = 0; j < events.length; j++) {
                    const e = events[j];
                    this.eventService.next(e);
                  }
                }
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
  }

  /**
   * Gets an observable for a specific event type
   * @param eventType The type of event to listen for
   */
  onEvent<T>(eventType: string): Observable<T> {
    return new Observable<T>((observer) => {
      const subscription = this.eventService.valueChanges().subscribe((event) => {
        if (event && event.type === eventType) {
          observer.next(event.data);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  /**
   * Adds a new queue to the list of queues
   * @private
   */
  private addNewQueue(): void {
    this.queues.push({
      status: this.QUEUE_STATUS_IDLE,
      actions: [],
      jobId: 0,
      progress: {
        unfinished: 0,
        finished: 0,
        errors: 0,
        class: 'text-muted',
        getInfoText: function getInfoText() {
          return this.finished + ' / ' + (this.finished + this.unfinished);
        }
      }
    });
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
    }

    // // Force UI update
    // timer(16).subscribe(() => {
    // });
  }

  /**
   * Triggers a job queue table update
   * @private
   */
  private triggerJobQueueTableUpdate(): void {
    this.calcQueueProgress();
    if (this.refreshQueueTableTimer) {
      clearTimeout(this.refreshQueueTableTimer);
    }
    this.refreshQueueTableTimer = setTimeout(() => {
      this.eventService.next({type: this.REFRESH_JOB_QUEUE_TABLE, data: ''});
    }, 1111);
  }

  /**
   * Triggers progress calculation and starts processing queues
   * @private
   */
  private triggerProgress(): void {
    this.calcQueueProgress();
    for (let i = 0; i < this.queues.length; i++) {
      const queue = this.queues[i];
      if (queue.status === this.QUEUE_STATUS_IDLE) {
        this.next(queue);
      }
    }
  }


  private executeAction(action: ActionEvent): Observable<DoEventIf> {
    return this.fileActionService.do(action.filePara);
  }
}

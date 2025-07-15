import {Injectable} from '@angular/core';
import {QueueActionEvent} from "../../domain/cmd/queue-action-event";
import {QueueActionEventType} from "../../domain/cmd/queue-action-event.type";
import {DirEvent, FileItemIf, FileItemMeta, FilePara, OnDoResponseType, PanelIndex} from "@fnf/fnf-data";
import {QueueStatus} from "../../domain/cmd/queue-status";
import {ActionQueueService} from "./action-queue.service";
import {QueueFileOperationParams} from "../../domain/cmd/queue-file-operation-params";
import {NotifyService} from "./notify-service";
import {QueueNotifyEventIf} from "../../domain/cmd/queue-notify-event.if";
import {QueueNotifyEvent} from "../../domain/cmd/queue-notify-event";

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  // Constants
  public static readonly BULK_LOWER_LIMIT = 30;
  readonly ACTION_STATUS_NEW: QueueStatus = 'NEW';

  private actionId = 0;

  // private eventService = new TypedEventService<any>();

  constructor(
    private actionQueueService: ActionQueueService,
    private readonly eventService: NotifyService
  ) {
    // console.info('        > CommandService initialized');
  }


  createActionEvent(
    key: QueueActionEventType,
    source: FileItemIf,
    target: FileItemIf,
    sourcePanelIndex: PanelIndex,
    targetPanelIndex: PanelIndex,
    bulk: boolean = false
  ): QueueActionEvent {
    const filePara = new FilePara(
      source,
      target,
      sourcePanelIndex,
      targetPanelIndex,
      key as unknown as any
    );

    return new QueueActionEvent(
      targetPanelIndex,
      filePara,
      this.ACTION_STATUS_NEW,
      bulk,
      this.actionId++
    );
  }

  createActionQueueEventWithFilePara(
    filePara: FilePara,
    bulk: boolean = false
  ): QueueActionEvent {

    const targetPanelIndex = filePara.targetPanelIndex ?? filePara.sourcePanelIndex ?? 0;

    return new QueueActionEvent(
      targetPanelIndex,
      filePara,
      this.ACTION_STATUS_NEW,
      bulk,
      this.actionId++
    );
  }

  /**
   * Refreshes a panel
   * @param panelIndex The panel index
   */
  createQueueActionEventForRefreshPanel(panelIndex: PanelIndex): QueueActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_REFRESH_PANEL,
      {} as FileItemIf,
      {} as FileItemIf,
      panelIndex,
      panelIndex,
      false
    );
  }

  /**
   * Creates a directory
   * @param para The parameters for the mkdir operation
   */
  createQueueActionEventForMkdir(para: { dir: string; base: string; panelIndex: PanelIndex }): QueueActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_MKDIR,
      {} as FileItemIf,
      {dir: para.dir, base: para.base} as FileItemIf,
      para.panelIndex,
      para.panelIndex,
      false
    );
  }

  /**
   * Deletes a file or directory
   * @param para The parameters for the delete operation
   */
  createQueueActionEventForDel(para: { source: FileItemIf; srcPanelIndex: PanelIndex; bulk?: boolean }): QueueActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const bulk = para.bulk || false;

    if (!bulk) {
      // Send event to show a placeholder in the target table
      // this.eventService.next({
      //   type: 'update',
      //   data: {
      //     panelIndex: srcPanelIndex,
      //     item: {dir: source.dir, base: source.base, status: 'temp'}
      //   }
      // });
    }

    return this.createActionEvent(
      this.actionQueueService.ACTION_REMOVE,
      source,
      null as unknown as FileItemIf,
      srcPanelIndex,
      srcPanelIndex,
      bulk
    );
  }

  /**
   * Deletes an empty directory
   * @param para The parameters for the createQueueActionEventForDelEmpty operation
   */
  createQueueActionEventForDelEmpty(para: { source: FileItemIf; srcPanelIndex: PanelIndex }): QueueActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_DELEMPTY,
      para.source,
      null as unknown as FileItemIf,
      para.srcPanelIndex,
      para.srcPanelIndex,
      false
    );
  }

  /**
   * Copies a file or directory
   * @param para The parameters for the copy operation
   */
  createQueueActionEventForCopy(para: QueueFileOperationParams): QueueActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const targetPanelIndex = para.targetPanelIndex;
    const target = para.target;
    const bulk = para.bulk || false;

    return this.createActionEvent(
      this.actionQueueService.ACTION_COPY,
      source,
      target,
      srcPanelIndex,
      targetPanelIndex,
      bulk
    );
  }

  /**
   * Moves a file or directory
   * @param para The parameters for the move operation
   */
  createQueueActionEventForMove(para: QueueFileOperationParams): QueueActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const target = para.target;
    // const targetPanelIndex = para.targetPanelIndex;
    const bulk = para.bulk || false;
    return this.createActionEvent(
      this.actionQueueService.ACTION_MOVE,
      source,
      target,
      srcPanelIndex,
      para.targetPanelIndex,
      bulk
    );
  }


  /**
   * Renames a file or directory
   * @param para The parameters for the rename operation
   */
  createQueueActionEventForRename(para: QueueFileOperationParams): QueueActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const target = para.target;
    const bulk = para.bulk || false;

    if (!bulk) {
      // Send event to show a placeholder
      if (srcPanelIndex !== undefined) {
        const item: OnDoResponseType = [
          new DirEvent(source.dir, [
            {...source, meta: new FileItemMeta('', 'temp', true)}
            //new FileItem(source.dir, source.base, '', '', 0, false, false, new FileItemMeta('', 'temp', true))
          ])];
        let o: QueueNotifyEventIf = new QueueNotifyEvent('update', item)
        this.eventService.next(o);
      }
    }

    return this.createActionEvent(
      this.actionQueueService.ACTION_RENAME,
      source,
      target,
      srcPanelIndex,
      para.targetPanelIndex,
      bulk
    );
  }

  /**
   * Adds actions to the queue
   * @param actions The actions to add
   * @param queueIndex The queue index
   * @param openJobTable Opens the Task Manager (Job table UI)
   */
  addActions(actions: QueueActionEvent[], queueIndex: number = 0, openJobTable:boolean = true): void {
    this.actionQueueService.addActions(actions, queueIndex);
    if (openJobTable){
      this.actionQueueService.openJobTable();
    }
  }


  createQueueActionEventForOpen(para: QueueFileOperationParams): QueueActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const target = para.target;
    const bulk = para.bulk || false;

    return this.createActionEvent(
      this.actionQueueService.ACTION_OPEN,
      source,
      target,
      srcPanelIndex,
      para.targetPanelIndex,
      bulk
    );
  }

}

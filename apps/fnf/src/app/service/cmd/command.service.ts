import {Injectable} from '@angular/core';
import {ActionEvent} from "../../domain/cmd/action-event";
import {ActionEventType} from "../../domain/cmd/action-event.type";
import {DirEvent, FileItem, FileItemIf, FileItemMeta, FilePara, OnDoResponseType} from "@fnf/fnf-data";
import {QueueStatus} from "../../domain/cmd/queue-status";
import {PanelIndex} from "../../domain/panel-index";
import {ActionQueueService} from "./action-queue.service";
import {FileOperationParams} from "../../domain/cmd/file-operation-params";
import {NotifyService} from "./notify-service";
import {NotifyEventIf} from "../../domain/cmd/notify-event.if";
import {NotifyEvent} from "../../domain/cmd/notify-event";

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  // Constants
  readonly BULK_LOWER_LIMIT = 30;
  readonly ACTION_STATUS_NEW: QueueStatus = 'NEW';

  private actionId = 0;

  // private eventService = new TypedEventService<any>();

  constructor(
    private actionQueueService: ActionQueueService,
    private readonly eventService: NotifyService
  ) {
    console.info('        > CommandService initialized');
  }

  /**
   * Creates an action event
   * @param key The action type
   * @param source The source file item
   * @param target The target file item
   * @param panelIndex The panel index
   * @param bulk Whether this is a bulk operation
   */
  createActionEvent(
    key: ActionEventType,
    source: FileItemIf,
    target: FileItemIf,
    panelIndex: PanelIndex,
    bulk: boolean = false
  ): ActionEvent {
    const filePara = new FilePara(
      source,
      target,
      key as unknown as any
    );

    return new ActionEvent(
      panelIndex,
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
  refreshPanel(panelIndex: PanelIndex): ActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_REFRESH_PANEL,
      {} as FileItemIf,
      {} as FileItemIf,
      panelIndex,
      false
    );
  }

  /**
   * Creates a directory
   * @param para The parameters for the mkdir operation
   */
  mkdir(para: { dir: string; base: string; panelIndex: PanelIndex }): ActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_MKDIR,
      {} as FileItemIf,
      {dir: para.dir, base: para.base} as FileItemIf,
      para.panelIndex,
      false
    );
  }

  /**
   * Deletes a file or directory
   * @param para The parameters for the delete operation
   */
  del(para: { source: FileItemIf; srcPanelIndex: PanelIndex; bulk?: boolean }): ActionEvent {
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
      bulk
    );
  }

  /**
   * Deletes an empty directory
   * @param para The parameters for the delempty operation
   */
  delempty(para: { source: FileItemIf; srcPanelIndex: PanelIndex }): ActionEvent {
    return this.createActionEvent(
      this.actionQueueService.ACTION_DELEMPTY,
      para.source,
      null as unknown as FileItemIf,
      para.srcPanelIndex,
      false
    );
  }

  /**
   * Copies a file or directory
   * @param para The parameters for the copy operation
   */
  copy(para: FileOperationParams): ActionEvent {
    const source = para.source;
    const srcPanelIndex = para.srcPanelIndex;
    const target = para.target;
    const bulk = para.bulk || false;

    return this.createActionEvent(
      this.actionQueueService.ACTION_COPY,
      source,
      target,
      srcPanelIndex,
      bulk
    );
  }

  /**
   * Moves a file or directory
   * @param para The parameters for the move operation
   */
  move(para: FileOperationParams): ActionEvent {
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
      bulk
    );
  }


  /**
   * Renames a file or directory
   * @param para The parameters for the rename operation
   */
  rename(para: FileOperationParams): ActionEvent {
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
        let o: NotifyEventIf = new NotifyEvent('update', item)
        this.eventService.next(o);
      }
    }

    return this.createActionEvent(
      this.actionQueueService.ACTION_RENAME,
      source,
      target,
      srcPanelIndex,
      bulk
    );
  }

  /**
   * Adds actions to the queue
   * @param actions The actions to add
   * @param queueIndex The queue index
   */
  addActions(actions: ActionEvent[], queueIndex: number = 0): void {
    this.actionQueueService.addActions(actions, queueIndex);
  }


}

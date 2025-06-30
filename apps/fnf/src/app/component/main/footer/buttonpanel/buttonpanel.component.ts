import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ShortcutComponent} from './shortcut/shortcut.component';
import {MatDivider} from '@angular/material/divider';
import {cssThemes, Theme} from '../../../../domain/customcss/css-theme-type';
import {AppService} from "../../../../app.service";
import {ActionId} from "../../../../domain/action/fnf-action.enum";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TaskList} from "../../../task/task-list/task-list";
import {ButtonEnableStates, buttonEnableStatesKey, CmdIf} from "@fnf/fnf-data";
import {MatList} from "@angular/material/list";
import {NotifyService} from "../../../../service/cmd/notify-service";
import {NotifyEventIf} from "../../../../domain/cmd/notify-event.if";
import {ActionQueueService} from "../../../../service/cmd/action-queue.service";
import {TaskButtonComponent} from "../../../task/task-list/task-button.component";

@Component({
  selector: 'app-button-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuTrigger,
    MatMenu,
    ShortcutComponent,
    MatMenuItem,
    MatDivider,
    MatList,
    TaskButtonComponent,
  ],
  templateUrl: './buttonpanel.component.html',
  styleUrls: ['./buttonpanel.component.css']
})
export class ButtonPanelComponent implements OnInit {

  @Input() buttonEnableStates = new ButtonEnableStates();

  themes = cssThemes;
  readonly buttons: { label: string, shortcut?: string, icon?: string, action: buttonEnableStatesKey }[] = [
    {
      label: 'Copy',
      icon: '',
      action: 'copy',
      shortcut: 'F3'
    },
    // TODO edit command
    // {
    //   label: 'Edit',
    //   icon: '',
    //   action: 'edit',
    //   shortcut: 'F4'
    // },
    {
      label: 'Move',
      icon: '',
      action: 'move',
      shortcut: 'F6'
    },
    {
      label: 'Create Dir',
      icon: '',
      action: 'mkdir',
      shortcut: 'F7'
    },
    {
      label: 'Delete',
      icon: '',
      action: 'remove',
      shortcut: 'F8'
    },
    // {
    //   label: 'Button 2',
    //   icon: 'close',
    //   action: 'edit'
    // },
  ];

  tools: CmdIf[]=[];

  constructor(
    private readonly appService: AppService,
    private readonly matBottomSheet: MatBottomSheet,
    private readonly notifyService: NotifyService,
    private readonly actionQueueService: ActionQueueService,
  ) {
  }

  ngOnInit(): void {
    this.notifyService
      .valueChanges()
      .subscribe(
        (evt: NotifyEventIf) => {
          //V TODO show status on button
          console.info('TODO NotifyEventIf', evt);
          console.info(this.actionQueueService.getQueues());
        }
      );
    this.tools = this.appService.getDefaultTools();
  }


  //private _bottomSheet = inject(MatBottomSheet);
  openButtonSheet() {
    this.matBottomSheet.open(TaskList);
  }

  onButtonClick(action: string): void {
    if (action === 'copy') {
      this.appService.copy();
    // } else if (action === 'edit') {
    //   this.appService.onEditClicked();
    } else if (action === 'move') {
      this.appService.move();
    } else if (action === 'mkdir') {
      this.appService.mkdir();
    } else if (action === 'remove') {
      this.appService.delete();
    }
  }


  onAddTabClicked() {
    this.appService.triggerAction('ADD_NEW_TAB');
  }

  onRemoveTabClicked() {
    this.appService.triggerAction('REMOVE_TAB');
  }


  triggerAction(id: ActionId) {
    this.appService.triggerAction(id);
  }


  onDebugClicked($event: MouseEvent) {
    this.appService.debug();
  }


  // openCustomColors() {
  //   const strWindowFeatures = "location=yes,height=600,width=800,scrollbars=yes,status=yes";
  //   const url = location.href + "/../customcss";
  //   window.open(url, "_blank", strWindowFeatures);
  // }

  setTheme(theme: Theme) {
    this.appService.setTheme(theme);
  }

  openShortcutDlg(evt: MouseEvent) {
    this.triggerAction('OPEN_SHORTCUT_DLG');
  }

  onToolClicked(tool: CmdIf) {
    this.appService.execute(tool);
  }

  getShortcutsByAction(action: ActionId) {
    return this.appService.getFirstShortcutByActionAsTokens(action);
  }
  getShortcutAsLabelTokens(sc:string):string[] {
    return this.appService.getShortcutAsLabelTokens(sc);
  }
}

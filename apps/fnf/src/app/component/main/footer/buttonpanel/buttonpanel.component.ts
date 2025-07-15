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
import {MatBottomSheet, MatBottomSheetConfig} from "@angular/material/bottom-sheet";
import {TaskList} from "../../../task/task-list/task-list";
import {ButtonEnableStates, buttonEnableStatesKey, CmdIf} from "@fnf/fnf-data";
import {MatList} from "@angular/material/list";
import {TaskButtonComponent} from "../../../task/task-list/task-button.component";
import {FnfActionLabels} from "../../../../domain/action/fnf-action-labels";
import {RouterLink} from "@angular/router";

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
    RouterLink,
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


  menuItems0: ActionId[] = [
    'OPEN_GOTO_ANYTHING_DLG',
    '-',
    'RELOAD_DIR',
    'OPEN_FIND_DLG',
    'OPEN_CHDIR_DLG',
    'TOGGLE_FILTER',
    'TOGGLE_HIDDEN_FILES',
    'TOGGLE_SHELL',
    "-",
    "COPY_2_CLIPBOARD_NAMES",
    "COPY_2_CLIPBOARD_NAMES_AS_JSON",
    "COPY_2_CLIPBOARD_FULLNAMES",
    "COPY_2_CLIPBOARD_FULLNAMES_AS_JSON",
    "-",
    "OPEN_SETUP_DLG"
  ];

  menuItems1: ActionId[] = [
    "OPEN_COPY_DLG",
    "OPEN_MOVE_DLG",
    "OPEN_DELETE_DLG",
    "OPEN_MKDIR_DLG",
    "OPEN_RENAME_DLG",
    "-",
    "OPEN_MULTIRENAME_DLG",
    "OPEN_MULTIMKDIR_DLG",
    "OPEN_GROUPFILES_DLG",
    "OPEN_DELETE_EMPTY_FOLDERS_DLG",
  ];

  menuItems2: ActionId[] = [
    "ENHANCE_SELECTION",
    "REDUCE_SELECTION",
    "TOGGLE_SELECTION",
    "SELECT_ALL",
    "DESELECT_ALL",
    "-",
    "NAVIGATE_LEVEL_DOWN",
    "NAVIGATE_BACK",
    // 'NAVIGATE_FORWARD',
    "-",
    "SELECT_LEFT_PANEL",
    "SELECT_RIGHT_PANEL",
    "TOGGLE_PANEL",
    "-",
    'ADD_NEW_TAB',
    'REMOVE_TAB'
  ];


  tools: CmdIf[] = [];

  constructor(
    private readonly appService: AppService,
    private readonly matBottomSheet: MatBottomSheet,
  ) {
  }

  ngOnInit(): void {
    this.tools = this.appService.getDefaultTools();
  }


  openButtonSheet() {
    const config = new MatBottomSheetConfig();
    config.panelClass = 'fnf-top-sheet';
    this.matBottomSheet.open(TaskList, config);
  }


  closeButtonSheet() {
    this.matBottomSheet.dismiss();
  }

  onButtonClick(action: string): void {
    if (action === 'copy') {
      this.appService.copy();
      // } else if (action === 'edit') {
      //   this.appService.onEditClicked();
    } else if (action === 'move') {
      this.appService.move();

    } else if (action === 'mkdir') {
      this.triggerAction('OPEN_MKDIR_DLG');
      // this.appService.openMakeDirDialog();

    } else if (action === 'remove') {
      this.appService.delete();
    }
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


  getShortcutAsLabelTokens(sc: string): string[] {
    return this.appService.getShortcutAsLabelTokens(sc);
  }

  getLabelByAction(action: ActionId): string {
    return FnfActionLabels.actionIdLabelMap[action] ?? action;
  }
}

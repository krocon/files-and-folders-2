import {Component, OnInit} from "@angular/core";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ShortcutService} from "../../service/shortcut.service";
import {JsonPipe} from "@angular/common";
import {actionIds} from "../../domain/action/fnf-action.enum";
import {ActionIdLabelShortcut} from "./action-id-label-shortcut";
import {FnfActionLabels} from "../../domain/action/fnf-action-labels";
import {ShortcutComponent} from "../main/footer/buttonpanel/shortcut/shortcut.component";

@Component({
  selector: "fnf-shortcut--dialog",
  templateUrl: "./shortcut-dialog.component.html",
  styleUrls: ["./shortcut-dialog.component.css"],
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    MatButton,
    MatDialogActions,
    JsonPipe,
    ShortcutComponent,
  ],
})
export class ShortcutDialogComponent implements OnInit {

  actionIdLabelShortcuts: ActionIdLabelShortcut[] = [];

  constructor(
    public readonly dialogRef: MatDialogRef<ShortcutDialogComponent>,
    public readonly shortcutService: ShortcutService,
  ) {
  }

  ngOnInit(): void {
    this.actionIdLabelShortcuts = actionIds.map(
      id => new ActionIdLabelShortcut(
        id,
        FnfActionLabels.actionIdLabelMap[id],
        this.shortcutService.getShortcutsByAction(id)
      )
    )
  }


  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

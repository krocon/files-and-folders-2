import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ShortcutService} from "../../service/shortcut.service";
import {actionIds} from "../../domain/action/fnf-action.enum";
import {ActionIdLabelShortcut} from "./action-id-label-shortcut";
import {FnfActionLabels} from "../../domain/action/fnf-action-labels";
import {ShortcutComponent} from "../main/footer/buttonpanel/shortcut/shortcut.component";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Subject, Subscription, debounceTime, distinctUntilChanged} from "rxjs";

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
    ShortcutComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconButton,
  ],
  standalone: true,
})
export class ShortcutDialogComponent implements OnInit, OnDestroy {

  actionIdLabelShortcuts: ActionIdLabelShortcut[] = [];
  allActionIdLabelShortcuts: ActionIdLabelShortcut[] = [];
  filterText = '';
  private filterTextChanged = new Subject<string>();
  private subscription: Subscription | null = null;

  constructor(
    public readonly dialogRef: MatDialogRef<ShortcutDialogComponent>,
    public readonly shortcutService: ShortcutService,
  ) {
    this.subscription = this.filterTextChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filterText => {
        this.applyFilter(filterText);
      });
  }

  ngOnInit(): void {
    this.allActionIdLabelShortcuts = actionIds
      .filter(id => !['DUMMY_ACTION', 'DO_NOTHING', 'OPEN_SHORTCUT_DLG'].includes(id))
      .map(
        id => new ActionIdLabelShortcut(
          id,
          FnfActionLabels.actionIdLabelMap[id],
          this.shortcutService.getShortcutsByAction(id)
        )
      );
    this.actionIdLabelShortcuts = [...this.allActionIdLabelShortcuts];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterTextChanged.next(input.value);
  }

  resetFilter(): void {
    this.filterText = '';
    this.actionIdLabelShortcuts = [...this.allActionIdLabelShortcuts];
  }

  private applyFilter(filterText: string): void {
    if (!filterText.trim()) {
      this.actionIdLabelShortcuts = [...this.allActionIdLabelShortcuts];
      return;
    }

    const lowerCaseFilter = filterText.toLowerCase();
    this.actionIdLabelShortcuts = this.allActionIdLabelShortcuts.filter(item => 
      item.actionId.toLowerCase().includes(lowerCaseFilter) ||
      item.label?.toLowerCase().includes(lowerCaseFilter) ||
      item.shortcuts?.some(shortcut => shortcut.toLowerCase().includes(lowerCaseFilter))
    );
  }


  onCancelClicked() {
    this.dialogRef.close(undefined);
  }


}

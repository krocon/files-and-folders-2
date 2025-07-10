import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {ConfirmationData} from "./data/confirmation.data";
import {ButtonData} from "./data/button.data";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "confirmationdialog",
  templateUrl: "./fnf-confirmation-dialog.component.html",
  imports: [
    CommonModule,
    MatDialogTitle,
    MatIconButton,
    MatFormField,
    MatInput,
    MatButton,
    MatDialogContent,
    MatFormField,
    FormsModule,
    MatCheckbox,
    MatIcon
  ],
  styleUrls: ["./fnf-confirmation-dialog.component.css"]
})
export class FnfConfirmationDialogComponent {
  public vertical = false;

  constructor(
    public dialogRef: MatDialogRef<FnfConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) {
    this.vertical = data.vertical;
  }

  onButtonClicked(btn: ButtonData) {
    this.dialogRef.close(btn.key);
  }

  onCloseClicked() {
    this.dialogRef.close("CANCEL");
  }
}

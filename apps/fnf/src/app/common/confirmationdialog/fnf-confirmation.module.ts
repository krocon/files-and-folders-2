import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {FnfConfirmationDialogComponent} from "./fnf-confirmation-dialog.component";
import {FnfConfirmationDialogService} from "./fnf-confirmation-dialog.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FnfConfirmationDialogComponent
  ],
  exports: [],
  providers: [FnfConfirmationDialogService]
})
export class FnfConfirmationModule {
}

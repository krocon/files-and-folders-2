import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: "fnf-text-logo",
  template: `
    <div class="div-logo">
      <div class="div-word div-left">Files</div>
      <div class="div-word div-middle">
        <div>and</div>
      </div>
      <div class="div-word div-right">Folders</div>
    </div>
  `,
  styleUrls: ["./fnf-text-logo.component.css"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FnfTextLogoComponent {
}

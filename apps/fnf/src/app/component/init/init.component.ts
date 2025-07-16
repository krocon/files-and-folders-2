import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: "fnf-init",
  template: `

    <div class="init-div">
      <span>Loading...</span>
    </div>
  `,
  styles: [`
      .init-div {
          display: grid;
          place-items: center;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitComponent {
}

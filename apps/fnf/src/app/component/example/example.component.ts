import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: "fnf-example",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-container">
      <h1>Example Standalone Component</h1>
      <p>This is an example of a standalone component with lazy loading.</p>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 20px;
      background-color: #f9f9f9;
    }
    
    h1 {
      color: #333;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  constructor() {
    console.log('ExampleComponent initialized');
  }
}
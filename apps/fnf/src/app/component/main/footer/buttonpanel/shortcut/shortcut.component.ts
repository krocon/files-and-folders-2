import {Component, Input} from "@angular/core";

@Component({
  standalone: true,
  selector: "fnf-shortcut",
  templateUrl: "./shortcut.component.html",
  imports: [],
  styleUrls: ["./shortcut.component.css"]
})
export class ShortcutComponent {

  @Input() keys: string[] = [];

}

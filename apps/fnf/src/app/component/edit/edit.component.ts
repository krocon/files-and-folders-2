import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {FileItemIf} from "@fnf/fnf-data";
import {EditService} from "../../service/edit.service";
import {fixPath} from "../../common/fn/path-2-dir-base.fn";

// TODO 2 buttons:  close, save
@Component({
  selector: "fnf-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ['edit.component.css'],
  imports: [
    FormsModule,
    EditorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  text: string = 'Loading...';

  fileItem: FileItemIf | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly editService: EditService,
  ) {
  }


  ngOnInit(): void {
    let item = localStorage.getItem('edit-selected-data');
    if (item) {
      this.fileItem = JSON.parse(item) as FileItemIf;
      let name = fixPath(this.fileItem.dir + '/' + this.fileItem.base);
      this.editService
        .loadFile(name)
        .subscribe(
          s => {
            this.text = s;
            this.cdr.detectChanges();
          }
        );
    }
  }

  save() {
    if (!this.fileItem) return; // skip

    let name = fixPath(this.fileItem.dir + '/' + this.fileItem.base);
    this.editService
      .saveFile(name, this.text)
      .subscribe(
        s => {
          this.text = s;
          this.cdr.detectChanges();
        }
      );
  }


}

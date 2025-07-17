import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {FileItemIf} from "@fnf/fnf-data";
import {QueueFileOperationParams} from "../../../../domain/cmd/queue-file-operation-params";

@Component({
  selector: 'group-files-target-cell-renderer',
  template: `
    <div class="ffn-name-cell-label">{{ base }}<b>{{ dir }}</b></div>
  `,
  styles: [`
      :host {
          width: 100%;
          height: 100%;
          display: flex;
          flex: 20px 1;
          align-items: center;
          gap: 10px;
          padding-top: 3px;
      }

      :host {
          padding-left: 10px;
      }

      .ffn-name-cell-label {
          white-space: nowrap;
          overflow: clip;
          display: flex;
          flex-direction: row-reverse;
          max-width: calc(100% - 10px);
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupFilesTargetCellRendererComponent implements ComponentRendererIf<QueueFileOperationParams> {

  dir: string = '';
  base: string = '';


  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: FileItemIf): RendererCleanupFnType | undefined {

    const fileItem = cellValue;
    if (!fileItem.dir && !fileItem.base) {
      this.dir = '';
      this.base = '';
      return undefined;
    }

    this.dir = fileItem.dir.endsWith('/') ? fileItem.dir : fileItem.dir + '/';
    this.base = fileItem.isDir ?  '['+fileItem.base+']' : fileItem.base;
    if (this.base.startsWith('/')) {
      this.base = this.base.substring(1);
    }

    return undefined;
  }


}

import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";
import {MatTooltip} from "@angular/material/tooltip";
import {QueueFileOperationParams} from "../../domain/cmd/queue-file-operation-params";

@Component({
  selector: 'multi-rename-name-cell-renderer',
  template: `
    <i [attr.class]="iconClass"></i>
    <div
        [matTooltipShowDelay]="2000"
        [matTooltip]="tooltip"
        class="ffn-name-cell-label"
        [class.rtl]="rtl"
    >{{ text }}</div>
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
      i {
          min-width: 16px;
          text-align: center;
      }

      .ffn-name-cell-label {
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          max-width: calc(100% - 40px);
      }
  `],
  imports: [
    MatTooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileItemNameCellRendererComponent implements ComponentRendererIf<QueueFileOperationParams> {

  iconClass: string = '';
  text: string = '';
  tooltip: string = '';
  rtl: boolean  = false;

  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: FileItemIf): RendererCleanupFnType | undefined {

    //const fop: QueueFileOperationParams = areaModel.getRowByIndex(rowIndex);
    const fileItem = cellValue;
    this.rtl = fileItem.abs;

    this.tooltip = fileItem.dir + '/' + fileItem.base;
    this.iconClass = this.getIconClass(fileItem);

    this.text = `${fileItem.base}`;

    return undefined;
  }



  private getIconClass(fileItem: FileItemIf): string {
    if (!fileItem) return '';
    
    if (fileItem.isDir) {
      if (fileItem.base === DOT_DOT) {
        return "fa fa-angle-left width-10px";
      }
      return "fa fa-folder";
    }

    // not a dir, it's a file:

    // @ts-ignore
    if (fileItem.error && fileItem.error['code'] === "EPERM") return "fa fa-file-alt";

    if (!fileItem.ext) return "fa fa-file-o";

    const ext = fileItem.ext;
    if (ext.match(/\.signature$/)) return "fa fa-file-signature-o";
    if (ext.match(/\.csv$/)) return "fa fa-file-csv-o";
    if (ext.match(/\.doc(x)?$/)) return "fa fa-file-word-o";
    if (ext.match(/\.epub$|\.rtf$|\.txt$/)) return "fa fa-file-text-o";
    if (ext.match(/\.pdf$/)) return "fa fa-file-pdf-o";
    if (ext.match(/\.avi$|\.mkv$|\.wmv$|\.mp(e)?g$|\.mov$|\.ram$/)) return "fa fa-file-video-o";
    if (ext.match(/\.ppt(x)?$/)) return "fa fa-file-powerpoint-o";
    if (ext.match(/\.xls(x)?$/)) return "fa fa-file-excel-o";
    if (ext.match(/\.bmp$|\.gif$|\.jpg$/)) return "fa fa-file-image-o";
    if (ext.match(/\.js$|\.java$|\.json$/)) return "fa fa-file-code-o";
    if (ext.match(/\.zip$|\.rarp$|\.7z$/)) return "fa fa-file-archive-o";
    if (ext.match(/\.mp3$|\.wav$/)) return "fa fa-file-audio-o";

    return "fa fa-file-o";
  }

}

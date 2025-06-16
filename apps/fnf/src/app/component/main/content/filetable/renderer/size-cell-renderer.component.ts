import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";
import {formatFileSize} from "../../../../../common/fn/format-file-size";

@Component({
  selector: 'size-cell-renderer',
  template: `
    <div [title]="tooltip">{{ text }}</div>`,
  styles: [`
      :host {
          width: 100%;
          height: 100%;
          display: block;
      }

      :host > div {
          padding-right: 10px;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SizeCellRendererComponent implements ComponentRendererIf<FileItemIf> {

  // Number of decimal places to use for file size formatting
  readonly DECIMAL_PLACES: number = 2;

  text: string = '';
  tooltip: string = '';


  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: any): RendererCleanupFnType | undefined {

    const fileItem: FileItemIf = areaModel.getRowByIndex(rowIndex);


    if (fileItem.base === DOT_DOT) {
      this.text = '';
      this.tooltip = '';
      return undefined;
    }

    if (fileItem.isDir) {
      this.text = ' DIR';
      this.tooltip = ' DIRECTORY';
      return undefined;
    }

    if (fileItem.status === "temp") {
      this.text = '-';
      this.tooltip = '-';
      return undefined;
    }

    const size = fileItem.size;
    const formattedSize = this.formatFileSize(size);
    this.text = formattedSize;
    this.tooltip = `${size.toLocaleString("en-US", {minimumFractionDigits: 0})} bytes (${formattedSize})`;

    return undefined;
  }

  private formatFileSize(size: number): string {
    return formatFileSize(size, this.DECIMAL_PLACES);
  }

}

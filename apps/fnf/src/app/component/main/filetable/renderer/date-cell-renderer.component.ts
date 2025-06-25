import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {FileItemIf} from "@fnf/fnf-data";

@Component({
  selector: 'date-cell-renderer',
  template: `
    <div>
      <div>{{ date }}</div>
      <small [title]="tooltip">{{ time }}</small></div>`,
  styles: [`
      :host {
          width: 100%;
          height: 100%;
          display: block;
          overflow-x: visible;
      }

      :host > div {
          padding-left: 10px;
          white-space: nowrap;
          display: grid;
          grid-template-columns: 9.5ch 1fr;
          align-items: baseline;
          /*grid-gap: 1ch;*/
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCellRendererComponent implements ComponentRendererIf<FileItemIf> {

  date: string = '';
  time: string = '';
  tooltip: string = '';

  setData(
    rowIndex: number,
    _columnIndex: number,
    _areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    _cellValue: any): RendererCleanupFnType | undefined {

    const fileItem: FileItemIf = areaModel.getRowByIndex(rowIndex);
    if (fileItem.date) {
      const dateTime = fileItem.date.split("T");
      this.date = dateTime[0];
      this.time = dateTime[1].substring(0, 5);
      this.tooltip = fileItem.date.replace(/T/g, "  ").split('.')[0];
    } else {
      this.date = '';
      this.time = '';
      this.tooltip = '';
    }
    return undefined;
  }


}

import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";

@Component({
  selector: 'multi-rename-target-cell-renderer',
  template: `
    <div class="ffn-name-cell-label"><pre>{{ text }}</pre></div>
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
          height: 20px;
          white-space: nowrap;
          overflow: clip;
          display: flex;
          flex-direction: row-reverse;
          max-width: calc(100% - 10px);
          font-family: monospace !important;
          font-size: 17px !important;
          line-height: 17px !important;
          
          pre {
              margin: 0;
          }
      }

      .ffn-name-cell-label:hover {
          font-weight: bold;
      }
      
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDirTargetCellRendererComponent implements ComponentRendererIf<string> {

  text: string = '';

  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: string): RendererCleanupFnType | undefined {

    this.text = cellValue;

    return undefined;
  }


}

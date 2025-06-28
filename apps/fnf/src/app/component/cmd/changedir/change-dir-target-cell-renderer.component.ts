import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {FileOperationParams} from "../../../domain/cmd/file-operation-params";

@Component({
  selector: 'multi-rename-target-cell-renderer',
  template: `
    <div class="ffn-name-cell-label"><pre>{{ dir }}<span class="base">{{ base }}</span></pre></div>
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
          font-size: 16px !important;
          line-height: 16px !important;
          
          pre {
              margin: 0;
          }
      }

      .ffn-name-cell-label:hover .base {
          font-weight: bold;
      }
      
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDirTargetCellRendererComponent implements ComponentRendererIf<FileOperationParams> {

  dir: string = '';
  base: string = '';


  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: string): RendererCleanupFnType | undefined {

    this.dir = cellValue
      .split('/')
      .map(w => '    |')
      .join('')
      .substring(5);
    this.base = '---' + this.getBase(cellValue);

    return undefined;
  }

  private getBase(fileName: string): string {
    const lastSlashIndex = fileName.lastIndexOf("/");
    return fileName.substring(lastSlashIndex+1);
  }

}

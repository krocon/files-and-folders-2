import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";


@Component({
  selector: 'ext-cell-renderer',
  template: `
    <div class="ffn-ext-cell-label">{{ text }}</div>`,
  styles: [`
      :host {
          width: 100%;
          height: 100%;
          display: flex;
          padding-top: 2px;
          padding-left: 12px;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionCellRendererComponent implements ComponentRendererIf<FileItemIf> {


  text: string = '';


  setData(
    rowIndex: number,
    _columnIndex: number,
    _areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    _cellValue: any): RendererCleanupFnType | undefined {

    const fileItem: FileItemIf = areaModel.getRowByIndex(rowIndex);
    const name = fileItem?.base;
    const ext = fileItem?.ext;

    if (name === DOT_DOT || fileItem?.isDir) {
      this.text = '';

    } else {
      this.text = ext?.startsWith('.') ? ext.substring(1) : ext;
    }

    return undefined;
  }

}

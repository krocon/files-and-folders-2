import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {DOT_DOT, FileItemIf} from "@fnf/fnf-data";
import {MatTooltip} from "@angular/material/tooltip";
import {FileOperationParams} from "../../../domain/cmd/file-operation-params";

@Component({
  selector: 'change-cell-renderer',
  template: `
    <div class="ffn-name-cell-label">{{ text }}</div>
  `,
  styles: [`
      :host {
          width: 100%;
          height: 100%;
          padding-top: 3px;
      }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeCellRendererComponent implements ComponentRendererIf<FileOperationParams> {


  text: string = '';


  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: any): RendererCleanupFnType | undefined {

    const fileOperationParams: FileOperationParams = areaModel.getRowByIndex(rowIndex);

    if (fileOperationParams?.source?.base !== fileOperationParams?.target?.base){
      this.text = '→';
    } else{
      this.text = '=';
    }

    return undefined;
  }

}

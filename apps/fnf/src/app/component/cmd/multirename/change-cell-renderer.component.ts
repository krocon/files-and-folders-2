import {ComponentRendererIf} from "@guiexpert/angular-table";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {AreaIdent, AreaModelIf, RendererCleanupFnType} from "@guiexpert/table";
import {QueueFileOperationParams} from "../../../domain/cmd/queue-file-operation-params";

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
export class ChangeCellRendererComponent implements ComponentRendererIf<QueueFileOperationParams> {


  text: string = '';


  setData(
    rowIndex: number,
    columnIndex: number,
    areaIdent: AreaIdent,
    areaModel: AreaModelIf,
    cellValue: any): RendererCleanupFnType | undefined {

    const fileOperationParams: QueueFileOperationParams = areaModel.getRowByIndex(rowIndex);

    if (fileOperationParams?.source?.base !== fileOperationParams?.target?.base){
      this.text = '→';
    } else{
      this.text = '=';
    }

    return undefined;
  }

}

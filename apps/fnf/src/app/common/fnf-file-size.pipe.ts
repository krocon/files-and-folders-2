import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: "fnfFileSize"})
export class FnfFileSizePipe implements PipeTransform {

  transform(bytes: number): string {
    const exp = Math.log(bytes) / Math.log(1024) | 0;
    const result = (bytes / Math.pow(1024, exp)).toFixed(2);
    return result + " " + (exp == 0 ? "bytes" : "KMGTPEZY"[exp - 1] + "B");
  }

}

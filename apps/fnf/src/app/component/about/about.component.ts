import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {takeWhile} from "rxjs/operators";
import {Sysinfo, SysinfoIf} from "@fnf/fnf-data";
import {SysinfoService} from "../../service/sysinfo.service";
import {JsonPipe} from "@angular/common";
import {FnfTextLogoComponent} from "../common/textlogo/fnf-text-logo.component";

@Component({
  selector: "fnf-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
  imports: [
    JsonPipe,
    FnfTextLogoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {

  sysinfo: SysinfoIf = new Sysinfo();
  private alive = true;

  constructor(
    private readonly sysinfoService: SysinfoService
  ) {
  }

  ngOnInit(): void {
    this.sysinfoService
      .getSysinfo()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(
        (sysinfo: SysinfoIf) => {
          this.sysinfo = sysinfo;
        });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}

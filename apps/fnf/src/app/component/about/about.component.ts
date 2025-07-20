import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {takeWhile} from "rxjs/operators";
import {AllinfoIf} from "@fnf/fnf-data";
import {SysinfoService} from "../../service/sysinfo.service";
import {JsonPipe} from "@angular/common";
import {FnfTextLogoComponent} from "../common/textlogo/fnf-text-logo.component";
import {Router} from "@angular/router";

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
export class AboutComponent implements OnInit, OnDestroy {

  info: AllinfoIf = {} as AllinfoIf;
  private alive = true;

  constructor(
    private readonly sysinfoService: SysinfoService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.sysinfoService
      .getAllinfo()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(
        (info: AllinfoIf) => {
          this.info = info;
          this.cdr.detectChanges();
        });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  navigateToFiles(): void {
    this.router.navigate(['/files']);
  }

}

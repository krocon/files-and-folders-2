import {Inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LookAndFeelData} from "../domain/look-and-feel.data";
import {DOCUMENT} from "@angular/common";
import {TypedDataService} from "../common/typed-data.service";
import {Socket} from "ngx-socket-io";
import {CssColors} from "@fnf/fnf-data";
import {cssThemes, Theme} from "../domain/customcss/css-theme-type";


@Injectable({
  providedIn: "root"
})
export class LookAndFeelService {

  private static readonly defaultTheme = "light";

  private static readonly innerService =
    new TypedDataService<Theme>("theme", LookAndFeelService.defaultTheme);

  private static readonly config = {
    getLookAndFeelUrl: "assets/config/color/%theme%.json"
  };

  // private lookAndFeelData?: LookAndFeelData;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly httpClient: HttpClient,
    private readonly socket: Socket
  ) {
  }

  static forRoot(config: { [key: string]: string }) {
    Object.assign(LookAndFeelService.config, config);
  }

  async init() {
    const themeName = this.getTheme();
    if (themeName) {
      await this.loadAndApplyLookAndFeel(themeName);
    }
    // wir lauschen auf css-Updates aus anderen Browser-Fenstern:
    this.socket
      .fromEvent<CssColors, string>("onCssUpdate")
      .subscribe(wd => {
        this.applyColors(wd);
      });
  }

  getAvailableThemes(): Observable<Theme[]> {
    return of(JSON.parse(JSON.stringify(cssThemes)));
  }

  getTheme(): Theme {
    return LookAndFeelService.innerService.getValue();
  }

  loadAndApplyLookAndFeel(theme: Theme) {
    const htmlElement = this.document.documentElement;
    htmlElement.setAttribute("favs-theme", theme);
    this.document.body.className = ""; // clear all
    this.document.body.classList.add(theme); // add one

    const subscription = this.getColors(theme)
      .subscribe(laf => {
        // this.lookAndFeelData = laf;
        this.applyLookAndFeel(laf);
        subscription.unsubscribe();
        LookAndFeelService.innerService.update(theme);
      });
  }

  getColors(theme: string): Observable<LookAndFeelData> {
    const url = LookAndFeelService.config
      .getLookAndFeelUrl
      .replace(/%theme%/g, theme);

    return this.httpClient.get<LookAndFeelData>(url);
  }

  emitColors(colors: CssColors) {
    this.socket.emit("updateCss", colors);
  }

  applyColors(colors: CssColors) {
    if (colors) {
      for (const key in colors) {
        const value = colors[key];
        document.documentElement.style.setProperty(key, value);
      }
    }
  }

  private applyLookAndFeel(laf: LookAndFeelData) {
    if (laf?.colors) {
      this.applyColors(laf?.colors);
      this.socket.emit("updateCss", laf?.colors);
      this.applyToMetaTag(laf);
    }
  }

  private applyToMetaTag(laf: LookAndFeelData) {
    // we set the color theme meta tag:
    [
      "theme-color",
      "msapplication-navbutton-color",
      "apple-mobile-web-app-status-bar-style"
    ].forEach(name =>
      document.querySelector("meta[name=" + name + "]")
        ?.setAttribute("content", laf.colors["var(--fnf-header-bg-color)"])
    );
  }

}

import {Injectable} from '@angular/core';
import {BrowserOsType} from "@fnf/fnf-data";


@Injectable({
  providedIn: 'root'
})
export class BrowserOsService {

  public browserOs: BrowserOsType;

  constructor() {
    this.browserOs = this.detectOS();
  }

  private detectOS(): BrowserOsType {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();

    if (userAgent.indexOf('mac') !== -1 || platform.indexOf('mac') !== -1) {
      return 'osx';
    }
    if (userAgent.indexOf('win') !== -1 || platform.indexOf('win') !== -1) {
      return 'windows';
    }
    if (userAgent.indexOf('linux') !== -1 || platform.indexOf('linux') !== -1 ||
      userAgent.indexOf('android') !== -1 || platform.indexOf('android') !== -1) {
      return 'linux';
    }

    // Default to 'osx' as specified in the issue description
    return 'osx';
  }
}

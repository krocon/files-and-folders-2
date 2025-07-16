import {TestBed} from '@angular/core/testing';

import {BrowserOsService} from './browser-os.service';

describe('BrowserOs', () => {
  let service: BrowserOsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserOsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

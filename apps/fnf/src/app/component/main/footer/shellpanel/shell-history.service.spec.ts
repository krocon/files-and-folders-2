import {TestBed} from '@angular/core/testing';
import {ShellHistoryService} from "./shell-history.service";


describe('ShellHistoryService', () => {
  let service: ShellHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

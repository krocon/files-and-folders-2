import {TestBed} from '@angular/core/testing';
import {MultiMkdirService} from './multi-mkdir.service';
import {MultiMkdirData} from './data/multi-mkdir.data';

describe('MultiMkdirService', () => {
  let service: MultiMkdirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiMkdirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateDirectoryNames', () => {
    it('should generate directory names with counter placeholder', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Test[C]',
        counterStart: 1,
        counterStep: 1,
        counterEnd: 3,
        counterDigits: 2
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['Test01', 'Test02', 'Test03']);
    });

    it('should respect counter start, step, and end values', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Folder[C]',
        counterStart: 10,
        counterStep: 5,
        counterEnd: 25,
        counterDigits: 3
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['Folder010', 'Folder015', 'Folder020', 'Folder025']);
    });

    it('should handle templates without counter placeholder', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'NoCounter',
        counterStart: 1,
        counterStep: 1,
        counterEnd: 3,
        counterDigits: 2
      };

      const result = service.generateDirectoryNames(data, '');

      // Should still create multiple directories based on counter settings
      expect(result).toEqual(['NoCounter', 'NoCounter', 'NoCounter']);
    });

    it('should handle zero counter steps', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Test[C]',
        counterStart: 1,
        counterStep: 0,
        counterEnd: 5,
        counterDigits: 2
      };

      // Should prevent infinite loop by defaulting to step 1
      const result = service.generateDirectoryNames(data, '');

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(100); // Reasonable limit
    });
  });
});
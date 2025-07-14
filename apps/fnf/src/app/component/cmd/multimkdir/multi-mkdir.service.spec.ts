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
        letterCase: '',
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
        letterCase: '',
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
        letterCase: '',
        counterStart: 1,
        counterStep: 1,
        counterEnd: 3,
        counterDigits: 2
      };

      const result = service.generateDirectoryNames(data, '');

      // Should still create multiple directories based on counter settings
      expect(result).toEqual(['NoCounter', 'NoCounter', 'NoCounter']);
    });

    it('should handle letter placeholder with default case', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Letter[L]',
        letterCase: '',
        counterStart: 0,
        counterStep: 1,
        counterEnd: 2,
        counterDigits: 1
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['Lettera', 'Letterb', 'Letterc']);
    });

    it('should handle letter placeholder with uppercase', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Letter[L]',
        letterCase: 'uppercase',
        counterStart: 0,
        counterStep: 1,
        counterEnd: 2,
        counterDigits: 1
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['LETTERA', 'LETTERB', 'LETTERC']);
    });

    it('should handle letter placeholder with lowercase', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: 'Letter[L]',
        letterCase: 'lowercase',
        counterStart: 0,
        counterStep: 1,
        counterEnd: 2,
        counterDigits: 1
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['lettera', 'letterb', 'letterc']);
    });

    it('should handle both counter and letter placeholders', () => {
      const data: MultiMkdirData = {
        folderNameTemplate: '[C]_[L]',
        letterCase: 'uppercase',
        counterStart: 1,
        counterStep: 1,
        counterEnd: 3,
        counterDigits: 2
      };

      const result = service.generateDirectoryNames(data, '');

      expect(result).toEqual(['01_B', '02_C', '03_D']);
    });

  });
});

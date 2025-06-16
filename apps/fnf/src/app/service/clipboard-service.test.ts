import {ClipboardService} from './clipboard-service';
import {Clipboard} from '@angular/cdk/clipboard';
import {FileItemIf} from "@fnf/fnf-data";

// Mock the Clipboard service
const mockClipboard = {
  copy: jest.fn().mockReturnValue(true)
};

describe('ClipboardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    // Reset mock calls before each test
    mockClipboard.copy.mockClear();

    // Create a new instance of ClipboardService with the mock Clipboard
    service = new ClipboardService(mockClipboard as unknown as Clipboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('copy', () => {
    it('should call clipboard.copy with the provided text', () => {
      const text = 'test text';
      service.copy(text);
      expect(mockClipboard.copy).toHaveBeenCalledWith(text);
    });

    it('should call the callback function when copy is successful', () => {
      const callback = jest.fn();
      service.copy('test text', callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should not call the callback function when copy fails', () => {
      mockClipboard.copy.mockReturnValueOnce(false);
      const callback = jest.fn();
      service.copy('test text', callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('copyNames', () => {
    it('should copy file names joined with newlines', () => {
      const files = [
        {base: 'file1.txt', dir: '/path/to'},
        {base: 'file2.txt', dir: '/path/to'}
      ];
      service.copyNames(files as FileItemIf[]);
      expect(mockClipboard.copy).toHaveBeenCalledWith('file1.txt\nfile2.txt');
    });
  });

  describe('copyNamesAsJson', () => {
    it('should copy file names as JSON', () => {
      const files = [
        {base: 'file1.txt', dir: '/path/to'},
        {base: 'file2.txt', dir: '/path/to'}
      ];
      service.copyNamesAsJson(files as FileItemIf[]);
      const expectedJson = JSON.stringify(['file1.txt', 'file2.txt'], null, ClipboardService.spaceCountForTab);
      expect(mockClipboard.copy).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe('copyFullNames', () => {
    it('should copy full file paths joined with newlines', () => {
      const files = [
        {base: 'file1.txt', dir: '/path/to'},
        {base: 'file2.txt', dir: '/path/to'}
      ];
      service.copyFullNames(files as FileItemIf[]);
      expect(mockClipboard.copy).toHaveBeenCalledWith('/path/to/file1.txt\n/path/to/file2.txt');
    });
  });

  describe('copyFullNamesAsJson', () => {
    it('should copy full file paths as JSON', () => {
      const files = [
        {base: 'file1.txt', dir: '/path/to'},
        {base: 'file2.txt', dir: '/path/to'}
      ];
      service.copyFullNamesAsJson(files as FileItemIf[]);
      const expectedJson = JSON.stringify(['/path/to/file1.txt', '/path/to/file2.txt'], null, ClipboardService.spaceCountForTab);
      expect(mockClipboard.copy).toHaveBeenCalledWith(expectedJson);
    });
  });
});
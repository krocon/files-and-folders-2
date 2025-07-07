import {getParentDir} from './get-parent-dir.fn';

describe('getParentDir', () => {
  it('should correctly split a simple path', () => {
    const result = getParentDir('/path/to/file.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });

  it('should handle paths with multiple segments', () => {
    const result = getParentDir('/very/long/path/with/multiple/segments/file.txt');
    expect(result).toEqual({
      dir: '/very/long/path/with/multiple/segments',
      base: 'file.txt'
    });
  });

  it('should handle paths with no extension', () => {
    const result = getParentDir('/path/to/filename');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'filename'
    });
  });

  it('should handle root-level files', () => {
    const result = getParentDir('/file.txt');
    expect(result).toEqual({
      dir: '',
      base: 'file.txt'
    });
  });

  it('should handle paths with trailing slash', () => {
    const result = getParentDir('/path/to/directory/');
    expect(result).toEqual({
      dir: '/path/to/directory',
      base: ''
    });
  });

  it('should handle paths with no slashes', () => {
    const result = getParentDir('filename.txt');
    expect(result).toEqual({
      dir: '',
      base: 'filename.txt'
    });
  });

  it('should handle empty paths', () => {
    const result = getParentDir('');
    expect(result).toEqual({
      dir: '',
      base: ''
    });
  });

  it('should handle paths with special characters', () => {
    const result = getParentDir('/path/with spaces/and#special$chars/file.txt');
    expect(result).toEqual({
      dir: '/path/with spaces/and#special$chars',
      base: 'file.txt'
    });
  });

  it('should handle Windows-style paths', () => {
    const result = getParentDir('C:/Users/username/Documents/file.txt');
    expect(result).toEqual({
      dir: 'C:/Users/username/Documents',
      base: 'file.txt'
    });
  });

  it('should handle paths with multiple dots', () => {
    const result = getParentDir('/path/to/file.with.multiple.dots.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.with.multiple.dots.txt'
    });
  });
});
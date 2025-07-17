import {dirBase2DirBase, fixBase2DirBase, fixPath, path2DirBase} from './path-2-dir-base.fn';

describe('path2DirBase', () => {
  it('should correctly split a simple path', () => {
    const result = path2DirBase('/path/to/file.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });
  it('should correctly fix the // problem', () => {
    const result = path2DirBase('/path//to//file.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });

  it('should handle paths with multiple segments', () => {
    const result = path2DirBase('/very/long/path/with/multiple/segments/file.txt');
    expect(result).toEqual({
      dir: '/very/long/path/with/multiple/segments',
      base: 'file.txt'
    });
  });

  it('should handle paths with no extension', () => {
    const result = path2DirBase('/path/to/filename');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'filename'
    });
  });

  it('should handle root-level files', () => {
    const result = path2DirBase('/file.txt');
    expect(result).toEqual({
      dir: '',
      base: 'file.txt'
    });
  });

  it('should handle paths with trailing slash', () => {
    const result = path2DirBase('/path/to/directory/');
    expect(result).toEqual({
      dir: '/path/to/directory',
      base: ''
    });
  });

  it('should handle paths with no slashes', () => {
    const result = path2DirBase('filename.txt');
    expect(result).toEqual({
      dir: '',
      base: 'filename.txt'
    });
  });

  it('should handle empty paths', () => {
    const result = path2DirBase('');
    expect(result).toEqual({
      dir: '',
      base: ''
    });
  });

  it('should handle paths with special characters', () => {
    const result = path2DirBase('/path/with spaces/and#special$chars/file.txt');
    expect(result).toEqual({
      dir: '/path/with spaces/and#special$chars',
      base: 'file.txt'
    });
  });

  it('should handle Windows-style paths', () => {
    const result = path2DirBase('C:/Users/username/Documents/file.txt');
    expect(result).toEqual({
      dir: 'C:/Users/username/Documents',
      base: 'file.txt'
    });
  });

  it('should handle paths with multiple dots', () => {
    const result = path2DirBase('/path/to/file.with.multiple.dots.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.with.multiple.dots.txt'
    });
  });
});

describe('dirBase2DirBase', () => {
  it('should correctly combine and split dir and base', () => {
    const result = dirBase2DirBase('/path/to', 'file.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });

  it('should handle double slashes', () => {
    const result = dirBase2DirBase('/path//to', 'file.txt');
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });

  it('should handle base with slashes', () => {
    const result = dirBase2DirBase('/path/to', 'subdir/file.txt');
    expect(result).toEqual({
      dir: '/path/to/subdir',
      base: 'file.txt'
    });
  });

  it('should handle empty dir', () => {
    const result = dirBase2DirBase('', 'file.txt');
    expect(result).toEqual({
      dir: '',
      base: 'file.txt'
    });
  });

  it('should handle empty base', () => {
    const result = dirBase2DirBase('/path/to', '');
    expect(result).toEqual({
      dir: '/path/to',
      base: ''
    });
  });
});

describe('fixBase2DirBase', () => {
  it('should fix dir and base properties', () => {
    const obj = {dir: '/path//to', base: 'file.txt'};
    const result = fixBase2DirBase(obj);
    expect(result).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
    // Should modify the original object
    expect(obj).toEqual({
      dir: '/path/to',
      base: 'file.txt'
    });
  });

  it('should handle base with path components', () => {
    const obj = {dir: '/path/to', base: 'subdir/file.txt'};
    const result = fixBase2DirBase(obj);
    expect(result).toEqual({
      dir: '/path/to/subdir',
      base: 'file.txt'
    });
  });

  it('should handle empty dir', () => {
    const obj = {dir: '', base: 'file.txt'};
    const result = fixBase2DirBase(obj);
    expect(result).toEqual({
      dir: '',
      base: 'file.txt'
    });
  });

  it('should handle empty base', () => {
    const obj = {dir: '/path/to', base: ''};
    const result = fixBase2DirBase(obj);
    expect(result).toEqual({
      dir: '/path/to',
      base: ''
    });
  });
});

describe('fixPath', () => {
  it('should replace double slashes with single slashes', () => {
    expect(fixPath('/path//to///file.txt')).toEqual('/path/to/file.txt');
  });

  it('should handle paths with no double slashes', () => {
    expect(fixPath('/path/to/file.txt')).toEqual('/path/to/file.txt');
  });

  it('should handle empty paths', () => {
    expect(fixPath('')).toEqual('');
  });

  it('should handle paths with only double slashes', () => {
    expect(fixPath('////')).toEqual('/');
  });
});

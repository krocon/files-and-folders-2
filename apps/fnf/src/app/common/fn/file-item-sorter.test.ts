import {fileItemSorter} from './file-item-sorter.fn';
import {FileItemIf} from "@fnf/fnf-data";

describe('fileItemSorter', () => {
  // Define DOT_DOT constant to match the one imported in the function
  const DOT_DOT = "..";

  // Test handling of null values
  it('should handle null values correctly', () => {
    const item: FileItemIf = {
      dir: '/path',
      base: 'file.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    expect(fileItemSorter(null as any, item)).toBe(1);
    expect(fileItemSorter(item, null as any)).toBe(-1);
  });

  // Test special handling for DOT_DOT
  it('should give highest priority to DOT_DOT items', () => {
    const dotDotItem: FileItemIf = {
      dir: '/path',
      base: DOT_DOT,
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const regularItem: FileItemIf = {
      dir: '/path',
      base: 'file.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    // DOT_DOT should come before regular items
    expect(fileItemSorter(dotDotItem, regularItem)).toBeLessThan(0);
    expect(fileItemSorter(regularItem, dotDotItem)).toBeGreaterThan(0);
  });

  // Test directories appearing before files
  it('should sort directories before files', () => {
    const dirItem: FileItemIf = {
      dir: '/path',
      base: 'folder',
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const fileItem: FileItemIf = {
      dir: '/path',
      base: 'file.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    // Directory should come before file
    expect(fileItemSorter(dirItem, fileItem)).toBeLessThan(0);
    expect(fileItemSorter(fileItem, dirItem)).toBeGreaterThan(0);
  });

  // Test alphabetical sorting by base name
  it('should sort items alphabetically by base name (case-insensitive)', () => {
    const itemA: FileItemIf = {
      dir: '/path',
      base: 'a_file.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    const itemB: FileItemIf = {
      dir: '/path',
      base: 'B_file.txt',
      ext: 'txt',
      size: 200,
      date: '2023-01-02',
      isDir: false,
      abs: true
    };

    const itemC: FileItemIf = {
      dir: '/path',
      base: 'c_file.txt',
      ext: 'txt',
      size: 300,
      date: '2023-01-03',
      isDir: false,
      abs: true
    };

    // Items should be sorted alphabetically regardless of case
    expect(fileItemSorter(itemA, itemB)).toBeLessThan(0);
    expect(fileItemSorter(itemB, itemC)).toBeLessThan(0);
    expect(fileItemSorter(itemA, itemC)).toBeLessThan(0);
  });

  // Test the effect of the factor parameter on sort order
  it('should respect the factor parameter for reversing sort order', () => {
    const dotDotItem: FileItemIf = {
      dir: '/path',
      base: DOT_DOT,
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const dirItem: FileItemIf = {
      dir: '/path',
      base: 'folder',
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const fileItem: FileItemIf = {
      dir: '/path',
      base: 'file.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    // With default factor (1), DOT_DOT comes first, then directories, then files
    expect(fileItemSorter(dotDotItem, dirItem)).toBeLessThan(0);
    expect(fileItemSorter(dirItem, fileItem)).toBeLessThan(0);

    // With factor (-1), the order should be reversed
    expect(fileItemSorter(dotDotItem, dirItem, -1)).toBeGreaterThan(0);
    expect(fileItemSorter(dirItem, fileItem, -1)).toBeGreaterThan(0);
  });

  // Test sorting of items of the same type (both directories or both files)
  it('should sort items of the same type alphabetically', () => {
    const dirA: FileItemIf = {
      dir: '/path',
      base: 'folderA',
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const dirB: FileItemIf = {
      dir: '/path',
      base: 'folderB',
      ext: '',
      size: 0,
      date: '2023-01-01',
      isDir: true,
      abs: true
    };

    const fileA: FileItemIf = {
      dir: '/path',
      base: 'fileA.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    const fileB: FileItemIf = {
      dir: '/path',
      base: 'fileB.txt',
      ext: 'txt',
      size: 100,
      date: '2023-01-01',
      isDir: false,
      abs: true
    };

    // Directories should be sorted alphabetically
    expect(fileItemSorter(dirA, dirB)).toBeLessThan(0);
    
    // Files should be sorted alphabetically
    expect(fileItemSorter(fileA, fileB)).toBeLessThan(0);
  });
});
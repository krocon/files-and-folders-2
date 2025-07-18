import {unpacklist} from './unpack-list.fn';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as StreamZip from 'node-stream-zip';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the unpacklist function
 * This function lists the contents of a zip file
 */
describe('unpacklist', () => {
  // Define test paths
  const testDir = path.resolve('./test');
  const sourceDir = path.join(testDir, 'demo');
  const zipFile = 'test-archive.zip';
  const zipFilePath = path.join(sourceDir, zipFile);

  // Mock StreamZip
  let mockEntries: jest.Mock;
  let mockClose: jest.Mock;

  // Setup and teardown for all tests
  beforeAll(async () => {
    // Set up the initial test environment
    await setupTestEnvironment();
  });

  afterAll(async () => {
    // Clean up the test environment after all tests
    await cleanupTestEnvironment();
  });

  // Setup and teardown for each test
  beforeEach(async () => {
    // Restore the test environment before each test
    await restoreTestEnvironment();

    // Create a mock zip file
    await fse.writeFile(zipFilePath, 'Mock zip file content');

    // Mock StreamZip.async
    mockEntries = jest.fn().mockResolvedValue({
      'file1.txt': {
        name: 'file1.txt',
        isDirectory: false,
        isFile: true,
        size: 100
      },
      'dir1/': {
        name: 'dir1/',
        isDirectory: true,
        isFile: false,
        size: 0
      },
      'dir1/file2.txt': {
        name: 'dir1/file2.txt',
        isDirectory: false,
        isFile: true,
        size: 200
      },
      'dir1/subdir/': {
        name: 'dir1/subdir/',
        isDirectory: true,
        isFile: false,
        size: 0
      },
      'dir1/subdir/file3.txt': {
        name: 'dir1/subdir/file3.txt',
        isDirectory: false,
        isFile: true,
        size: 300
      }
    });

    mockClose = jest.fn().mockResolvedValue(undefined);

    jest.spyOn(StreamZip, 'async').mockImplementation(() => {
      return {
        entries: mockEntries,
        close: mockClose,
        extract: jest.fn().mockResolvedValue(undefined),
        entriesCount: 5,
        comment: '',
        entry: jest.fn(),
        entryData: jest.fn(),
        stream: jest.fn(),
        on: jest.fn()
      } as any;
    });
  });

  afterEach(async () => {
    // Restore the original StreamZip.async
    jest.restoreAllMocks();
  });

  /**
   * Test listing the contents of a zip file
   */
  it('should list the contents of a zip file', async () => {
    // Act
    const result = await unpacklist(zipFilePath);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1); // Returns a single DirEvent

    // Check if StreamZip.async was called with the correct file
    expect(StreamZip.async).toHaveBeenCalledWith({file: zipFilePath});

    // Check if entries was called
    expect(mockEntries).toHaveBeenCalled();

    // Check if close was called
    expect(mockClose).toHaveBeenCalled();

    // Check the DirEvent
    const dirEvent = result[0];
    expect(dirEvent.action).toBe('list');
    expect(dirEvent.begin).toBe(true);
    expect(dirEvent.end).toBe(true);
    expect(dirEvent.dir).toBe(`${zipFilePath}:`);

    // Check the FileItems in the DirEvent
    const fileItems = dirEvent.items;
    expect(fileItems.length).toBe(5); // 5 entries in the mock zip

    // Check for file1.txt
    const file1 = fileItems.find(item => item.base === 'file1.txt');
    expect(file1).toBeDefined();
    expect(file1.isDir).toBe(false);
    expect(file1.size).toBe(100);

    // Check for dir1
    const dir1 = fileItems.find(item => item.base === 'dir1');
    expect(dir1).toBeDefined();
    expect(dir1.isDir).toBe(true);

    // Check for file2.txt in dir1
    const file2 = fileItems.find(item => item.base === 'file2.txt' && item.dir.includes('dir1'));
    expect(file2).toBeDefined();
    expect(file2.isDir).toBe(false);
    expect(file2.size).toBe(200);
  });

  /**
   * Test error handling when the zip file doesn't exist
   */
  it('should throw an error when the zip file does not exist', async () => {
    // Arrange
    const nonExistentZip = path.join(sourceDir, 'non-existent.zip');

    // Mock StreamZip.async to throw an error
    jest.spyOn(StreamZip, 'async').mockImplementation(() => {
      throw new Error('File not found');
    });

    // Act & Assert
    await expect(unpacklist(nonExistentZip)).rejects.toThrow();
  });

  /**
   * Test error handling when entries fails
   */
  it('should throw an error when entries fails', async () => {
    // Arrange
    mockEntries.mockRejectedValue(new Error('Failed to read entries'));

    // Act & Assert
    await expect(unpacklist(zipFilePath)).rejects.toThrow();
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(unpacklist(null)).rejects.toThrow('Invalid argument exception!');
    await expect(unpacklist('')).rejects.toThrow('Invalid argument exception!');
  });
});

import {remove} from './remove.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the remove function
 * This function deletes files or directories from the file system
 */
describe('remove', () => {
  // Define test paths
  const testDir = path.resolve('./test');
  const sourceDir = path.join(testDir, 'demo');
  const testFile = 'file-to-remove.txt';
  const testDir1 = 'dir-to-remove';
  const testDir2 = 'nested-dir-to-remove';

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

    // Create test file
    const testFilePath = path.join(sourceDir, testFile);
    await fse.writeFile(testFilePath, 'This file will be removed.');

    // Create test directory
    const testDirPath = path.join(sourceDir, testDir1);
    await fse.ensureDir(testDirPath);

    // Create nested test directory with files
    const nestedDirPath = path.join(sourceDir, testDir2);
    await fse.ensureDir(nestedDirPath);
    await fse.ensureDir(path.join(nestedDirPath, 'subdir'));
    await fse.writeFile(path.join(nestedDirPath, 'test.txt'), 'Test file in nested directory');
    await fse.writeFile(path.join(nestedDirPath, 'subdir', 'subfile.txt'), 'Test file in subdirectory');
  });

  /**
   * Test removing a file
   */
  it('should remove a file and return correct DirEvents', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'remove');

    // Act
    const result = await remove(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Check if file was removed
    const testFilePath = path.join(sourceDir, testFile);
    expect(await fse.pathExists(testFilePath)).toBe(false);

    // Check DirEvents
    expect(result.length).toBe(1);
    expect(result[0].action).toBe('unlink');
    expect(result[0].items[0].base).toBe(testFile);
  });

  /**
   * Test removing an empty directory
   */
  it('should remove an empty directory and return correct DirEvents', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testDir1, '');
    source.isDir = true;
    const filePara = new FilePara(source, null, 0, 0, 'remove');

    // Act
    const result = await remove(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory was removed
    const testDirPath = path.join(sourceDir, testDir1);
    expect(await fse.pathExists(testDirPath)).toBe(false);

    // Check DirEvents
    expect(result.length).toBe(1);
    expect(result[0].action).toBe('unlinkDir');
    expect(result[0].items[0].base).toBe(testDir1);
  });

  /**
   * Test removing a directory with contents
   */
  it('should remove a directory with contents recursively', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testDir2, '');
    source.isDir = true;
    const filePara = new FilePara(source, null, 0, 0, 'remove');

    // Act
    const result = await remove(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory and all contents were removed
    const nestedDirPath = path.join(sourceDir, testDir2);
    expect(await fse.pathExists(nestedDirPath)).toBe(false);

    // Check DirEvents
    expect(result.length).toBe(1);
    expect(result[0].action).toBe('unlinkDir');
    expect(result[0].items[0].base).toBe(testDir2);
  });

  /**
   * Test error handling when source doesn't exist
   */
  it('should not throw an error when source does not exist', async () => {
    // Arrange
    const nonExistentFile = 'non-existent-file.txt';
    const source = new FileItem(sourceDir, nonExistentFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'remove');

    // Act & Assert
    // fs-extra's remove function doesn't throw if the file doesn't exist
    const result = await remove(filePara);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(remove(null)).rejects.toThrow('Invalid argument exception!');
    await expect(remove({} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

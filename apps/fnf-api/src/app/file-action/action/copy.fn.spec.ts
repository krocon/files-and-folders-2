import {copy} from './copy.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the copy function
 */
describe('copy', () => {
  // Define test paths
  const testDir = path.resolve('./test');
  const sourceDir = path.join(testDir, 'demo');
  const targetDir = path.join(testDir, 'target');
  const testFile = 'test-file.txt';
  const nestedDir = 'nested';

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
  });

  /**
   * Test copying a file
   */
  it('should copy a file and return correct DirEvents', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'copy');

    // Act
    const result = await copy(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Check if file was copied
    const targetFilePath = path.join(targetDir, testFile);
    expect(await fse.pathExists(targetFilePath)).toBe(true);

    // Check content of copied file
    const content = await fse.readFile(targetFilePath, 'utf8');
    expect(content).toBe('This is a test file for file operations.');

    // Check DirEvents
    expect(result.length).toBeGreaterThan(0);
    const addEvent = result.find(event => event.action === 'add');
    expect(addEvent).toBeDefined();
    expect(addEvent.items[0].base).toBe(testFile);
  });

  /**
   * Test copying a directory
   */
  it('should copy a directory recursively', async () => {
    // Arrange
    const nestedPath = path.join(sourceDir, nestedDir);
    const source = new FileItem(sourceDir, nestedDir, '');
    source.isDir = true;
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'copy');

    // Act
    const result = await copy(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory was copied
    const targetNestedPath = path.join(targetDir, nestedDir);
    expect(await fse.pathExists(targetNestedPath)).toBe(true);

    // Check if nested file was copied
    const nestedFilePath = path.join(targetNestedPath, 'nested-file.txt');
    expect(await fse.pathExists(nestedFilePath)).toBe(true);

    // Check DirEvents
    expect(result.length).toBeGreaterThan(0);
    const addDirEvent = result.find(event => event.action === 'addDir');
    expect(addDirEvent).toBeDefined();
    expect(addDirEvent.items[0].base).toBe(nestedDir);
  });

  /**
   * Test error handling when source doesn't exist
   */
  it('should throw an error when source does not exist', async () => {
    // Arrange
    const nonExistentFile = 'non-existent-file.txt';
    const source = new FileItem(sourceDir, nonExistentFile, 'txt');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'copy');

    // Act & Assert
    await expect(copy(filePara)).rejects.toThrow();
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(copy(null)).rejects.toThrow('Invalid argument exception!');
    await expect(copy({} as FilePara)).rejects.toThrow('Invalid argument exception!');
    await expect(copy({source: {}} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

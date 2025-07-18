import {rename} from './rename.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the rename function
 * This function renames files or directories in the file system
 */
describe('rename', () => {
  // Define test paths
  const testDir = path.resolve('./test');
  const sourceDir = path.join(testDir, 'demo');
  const testFile = 'file-to-rename.txt';
  const renamedFile = 'renamed-file.txt';
  const testDir1 = 'dir-to-rename';
  const renamedDir = 'renamed-dir';

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
    await fse.writeFile(testFilePath, 'This file will be renamed.');

    // Create test directory
    const testDirPath = path.join(sourceDir, testDir1);
    await fse.ensureDir(testDirPath);
    await fse.writeFile(path.join(testDirPath, 'test.txt'), 'Test file in directory');
  });

  /**
   * Test renaming a file
   */
  it('should rename a file and return correct DirEvents', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const target = new FileItem(sourceDir, renamedFile, 'txt');
    const filePara = new FilePara(source, target, 0, 0, 'rename');

    // Act
    const result = await rename(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Check if file was renamed
    const originalPath = path.join(sourceDir, testFile);
    const renamedPath = path.join(sourceDir, renamedFile);
    expect(await fse.pathExists(originalPath)).toBe(false);
    expect(await fse.pathExists(renamedPath)).toBe(true);

    // Check content of renamed file
    const content = await fse.readFile(renamedPath, 'utf8');
    expect(content).toBe('This file will be renamed.');

    // Check DirEvents
    expect(result.length).toBe(3); // add, unlink, focus

    const addEvent = result.find(event => event.action === 'add');
    const unlinkEvent = result.find(event => event.action === 'unlink');
    const focusEvent = result.find(event => event.action === 'focus');

    expect(addEvent).toBeDefined();
    expect(unlinkEvent).toBeDefined();
    expect(focusEvent).toBeDefined();

    expect(addEvent.items[0].base).toBe(renamedFile);
    expect(unlinkEvent.items[0].base).toBe(testFile);
    expect(focusEvent.items[0].base).toBe(renamedFile);
  });

  /**
   * Test renaming a directory
   */
  it('should rename a directory and return correct DirEvents', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testDir1, '');
    source.isDir = true;
    const target = new FileItem(sourceDir, renamedDir, '');
    target.isDir = true;
    const filePara = new FilePara(source, target, 0, 0, 'rename');

    // Act
    const result = await rename(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory was renamed
    const originalPath = path.join(sourceDir, testDir1);
    const renamedPath = path.join(sourceDir, renamedDir);
    expect(await fse.pathExists(originalPath)).toBe(false);
    expect(await fse.pathExists(renamedPath)).toBe(true);

    // Check if contents were preserved
    const testFilePath = path.join(renamedPath, 'test.txt');
    expect(await fse.pathExists(testFilePath)).toBe(true);

    // Check DirEvents
    expect(result.length).toBe(3); // addDir, unlinkDir, focus

    const addDirEvent = result.find(event => event.action === 'addDir');
    const unlinkDirEvent = result.find(event => event.action === 'unlinkDir');
    const focusEvent = result.find(event => event.action === 'focus');

    expect(addDirEvent).toBeDefined();
    expect(unlinkDirEvent).toBeDefined();
    expect(focusEvent).toBeDefined();

    expect(addDirEvent.items[0].base).toBe(renamedDir);
    expect(unlinkDirEvent.items[0].base).toBe(testDir1);
    expect(focusEvent.items[0].base).toBe(renamedDir);
  });

  /**
   * Test error handling when source doesn't exist
   */
  it('should throw an error when source does not exist', async () => {
    // Arrange
    const nonExistentFile = 'non-existent-file.txt';
    const source = new FileItem(sourceDir, nonExistentFile, 'txt');
    const target = new FileItem(sourceDir, renamedFile, 'txt');
    const filePara = new FilePara(source, target, 0, 0, 'rename');

    // Act & Assert
    await expect(rename(filePara)).rejects.toThrow();
  });

  /**
   * Test error handling when target already exists
   */
  it('should throw an error when target already exists', async () => {
    // Arrange
    const existingFile = 'existing-file.txt';
    const existingFilePath = path.join(sourceDir, existingFile);
    await fse.writeFile(existingFilePath, 'This is an existing file.');

    const source = new FileItem(sourceDir, testFile, 'txt');
    const target = new FileItem(sourceDir, existingFile, 'txt');
    const filePara = new FilePara(source, target, 0, 0, 'rename');

    // Act & Assert
    await expect(rename(filePara)).rejects.toThrow();

    // Clean up
    await fse.remove(existingFilePath);
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(rename(null)).rejects.toThrow('Invalid argument exception!');
    await expect(rename({} as FilePara)).rejects.toThrow('Invalid argument exception!');
    await expect(rename({source: {}} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

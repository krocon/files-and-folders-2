import {mkdir} from './mkdir.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the mkdir function
 * This function creates a new directory at the specified location
 */
describe('mkdir', () => {
  // Define test paths
  const rootDir = process.cwd();
  const testDir = path.join(rootDir, './test');
  const targetDir = path.join(testDir, 'target');

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
   * Test creating a directory
   */
  it('should create a directory and return correct DirEvents', async () => {
    // Arrange
    const newDirName = 'new-directory-2';
    const target = new FileItem(targetDir, newDirName, '');
    target.isDir = true;
    const filePara = new FilePara(null, target, 0, 0, 'mkdir');

    // Act
    const result = await mkdir(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Check if directory was created
    const newDirPath = path.join(targetDir, newDirName);
    expect(await fse.pathExists(newDirPath)).toBe(true);

    // Check if it's a directory
    const stats = await fse.stat(newDirPath);
    expect(stats.isDirectory()).toBe(true);

    // Check DirEvents
    expect(result.length).toBe(3); // Should return 3 events: addDir, unselectall, focus

    const addDirEvent = result.find(event => event.action === 'addDir');
    expect(addDirEvent).toBeDefined();
    expect(addDirEvent.items[0].base).toBe(newDirName);
    expect(addDirEvent.items[0].isDir).toBe(true);

    const unselectAllEvent = result.find(event => event.action === 'unselectall');
    expect(unselectAllEvent).toBeDefined();

    const focusEvent = result.find(event => event.action === 'focus');
    expect(focusEvent).toBeDefined();
    expect(focusEvent.items[0].base).toBe(newDirName);
  });

  /**
   * Test creating a nested directory
   */
  it('should create a nested directory', async () => {
    // Arrange
    const nestedPath = 'nested/deep/directory2';
    const target = new FileItem(targetDir, nestedPath, '');
    target.isDir = true;
    const filePara = new FilePara(null, target, 0, 0, 'mkdir');

    // Act
    const result = await mkdir(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory was created
    const newDirPath = path.join(targetDir, nestedPath);
    expect(await fse.pathExists(newDirPath)).toBe(true);

    // Check if it's a directory
    const stats = await fse.stat(newDirPath);
    expect(stats.isDirectory()).toBe(true);
  });

  /**
   * Test error handling when directory already exists
   */
  it('should throw an error when directory already exists', async () => {
    // Arrange
    const existingDirName = 'existing-directory-2';
    const existingDirPath = path.join(targetDir, existingDirName);

    // Create the directory first
    await fse.mkdir(existingDirPath);

    const target = new FileItem(targetDir, existingDirName, '');
    target.isDir = true;
    const filePara = new FilePara(null, target, 0, 0, 'mkdir');

    // Act & Assert
    await expect(mkdir(filePara)).rejects.toThrow();
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(mkdir(null)).rejects.toThrow('Invalid argument exception!');
    await expect(mkdir({} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

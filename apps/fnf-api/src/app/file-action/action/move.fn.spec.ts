import {move} from './move.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the move function
 * This function moves files or directories from one location to another
 */
describe('move', () => {
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

    // Create a copy of the nested directory for move tests
    const nestedSourcePath = path.join(sourceDir, nestedDir);
    const nestedTestPath = path.join(sourceDir, 'nested-for-move');
    if (await fse.pathExists(nestedSourcePath) && !await fse.pathExists(nestedTestPath)) {
      await fse.copy(nestedSourcePath, nestedTestPath);
    }
  });

  /**
   * Test moving a file
   */
  it('should move a file and return correct DirEvents', async () => {
    // Arrange
    const testMoveFile = 'file-to-move.txt';
    const sourceFilePath = path.join(sourceDir, testMoveFile);

    // Create a file specifically for this test
    await fse.writeFile(sourceFilePath, 'This file will be moved.');

    const source = new FileItem(sourceDir, testMoveFile, 'txt');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'move');

    // Act
    const result = await move(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Check if file was moved (source should no longer exist)
    expect(await fse.pathExists(sourceFilePath)).toBe(false);

    // Check if file exists at target
    const targetFilePath = path.join(targetDir, testMoveFile);
    expect(await fse.pathExists(targetFilePath)).toBe(true);

    // Check content of moved file
    const content = await fse.readFile(targetFilePath, 'utf8');
    expect(content).toBe('This file will be moved.');

    // Check DirEvents
    expect(result.length).toBeGreaterThan(0);
    const unlinkEvent = result.find(event => event.action === 'unlink');
    const addEvent = result.find(event => event.action === 'add');

    expect(unlinkEvent).toBeDefined();
    expect(addEvent).toBeDefined();
    expect(unlinkEvent.items[0].base).toBe(testMoveFile);
    expect(addEvent.items[0].base).toBe(testMoveFile);
  });

  /**
   * Test moving a directory
   */
  it('should move a directory recursively', async () => {
    // Arrange
    const dirToMove = 'nested-for-move';
    const sourceDirPath = path.join(sourceDir, dirToMove);

    const source = new FileItem(sourceDir, dirToMove, '');
    source.isDir = true;
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'move');

    // Act
    const result = await move(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if directory was moved (source should no longer exist)
    expect(await fse.pathExists(sourceDirPath)).toBe(false);

    // Check if directory exists at target
    const targetDirPath = path.join(targetDir, dirToMove);
    expect(await fse.pathExists(targetDirPath)).toBe(true);

    // Check DirEvents
    expect(result.length).toBeGreaterThan(0);
    const unlinkDirEvent = result.find(event => event.action === 'unlinkDir');
    const addDirEvent = result.find(event => event.action === 'addDir');

    expect(unlinkDirEvent).toBeDefined();
    expect(addDirEvent).toBeDefined();
    expect(unlinkDirEvent.items[0].base).toBe(dirToMove);
    expect(addDirEvent.items[0].base).toBe(dirToMove);
  });

  /**
   * Test error handling when source doesn't exist
   */
  it('should throw an error when source does not exist', async () => {
    // Arrange
    const nonExistentFile = 'non-existent-file.txt';
    const source = new FileItem(sourceDir, nonExistentFile, 'txt');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 1, 'move');

    // Act & Assert
    await expect(move(filePara)).rejects.toThrow();
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(move(null)).rejects.toThrow('Invalid argument exception!');
    await expect(move({} as FilePara)).rejects.toThrow('Invalid argument exception!');
    await expect(move({source: {}} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

import {open} from './open.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as executeCommandModule from './common/execute-command';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the open function
 * This function opens files with the system's default application
 */
describe('open', () => {
  // Define test paths
  const testDir = path.resolve('./apps/fnf-api/test');
  const sourceDir = path.join(testDir, 'demo');
  const testFile = 'test-file.txt';

  // Mock the executeCommand function
  let executeCommandSpy: jest.SpyInstance;

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

    // Create test file for opening
    const testFilePath = path.join(sourceDir, testFile);
    await fse.writeFile(testFilePath, 'This is a test file for opening.');

    // Mock the executeCommand function
    executeCommandSpy = jest.spyOn(executeCommandModule, 'executeCommand').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    // Restore the original executeCommand function
    executeCommandSpy.mockRestore();
  });

  /**
   * Test opening a file on Windows
   */
  (os.platform().indexOf('win') === 0 ? it : it.skip)('should generate correct command for Windows', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'open');
    const expectedPath = path.join(sourceDir, testFile);

    // Act
    await open(filePara);

    // Assert
    expect(executeCommandSpy).toHaveBeenCalledTimes(1);
    const command = executeCommandSpy.mock.calls[0][0];
    expect(command).toContain('start');
    expect(command).toContain(expectedPath);
  });

  /**
   * Test opening a file on macOS
   */
  (os.platform() === 'darwin' ? it : it.skip)('should generate correct command for macOS', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'open');
    const expectedPath = path.join(sourceDir, testFile);

    // Act
    await open(filePara);

    // Assert
    expect(executeCommandSpy).toHaveBeenCalledTimes(1);
    const command = executeCommandSpy.mock.calls[0][0];
    expect(command).toContain('open');
    expect(command).toContain(expectedPath);
  });

  /**
   * Test opening a file on Linux
   */
  (os.platform().indexOf('linux') === 0 ? it : it.skip)('should generate correct command for Linux', async () => {
    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'open');
    const expectedPath = path.join(sourceDir, testFile);

    // Act
    await open(filePara);

    // Assert
    expect(executeCommandSpy).toHaveBeenCalledTimes(1);
    const command = executeCommandSpy.mock.calls[0][0];
    expect(command).toContain('evince');
    expect(command).toContain(expectedPath);
  });

  /**
   * Test fallback to alternate command when first command fails
   */
  (os.platform().indexOf('linux') === 0 ? it : it.skip)('should try alternate command when first command fails', async () => {
    // Mock executeCommand to fail on first call and succeed on second
    executeCommandSpy.mockReset();
    executeCommandSpy
      .mockRejectedValueOnce(new Error('Command failed'))
      .mockResolvedValueOnce(undefined);

    // Arrange
    const source = new FileItem(sourceDir, testFile, 'txt');
    const filePara = new FilePara(source, null, 0, 0, 'open');

    // Act
    await open(filePara);

    // Assert
    expect(executeCommandSpy).toHaveBeenCalledTimes(2);
    const secondCommand = executeCommandSpy.mock.calls[1][0];
    expect(secondCommand).toContain('kpdf');
  });

  /**
   * Test error handling for unsupported platform
   */
  it('should throw an error for unsupported platform', async () => {
    // Save the original platform function
    const originalPlatform = Object.getOwnPropertyDescriptor(os, 'platform');

    try {
      // Mock os.platform to return an unsupported platform
      Object.defineProperty(os, 'platform', {
        value: jest.fn().mockReturnValue('freebsd')
      });

      // Arrange
      const source = new FileItem(sourceDir, testFile, 'txt');
      const filePara = new FilePara(source, null, 0, 0, 'open');

      // Act & Assert
      await expect(open(filePara)).rejects.toThrow('open file-content is not supported for this system');
    } finally {
      // Restore original os.platform
      if (originalPlatform) {
        Object.defineProperty(os, 'platform', originalPlatform);
      }
    }
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(open(null)).rejects.toThrow('Invalid argument exception!');
    await expect(open({} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

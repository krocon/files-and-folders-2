import {unpack} from './unpack.fn';
import {FileItem, FilePara} from '@fnf/fnf-data';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as StreamZip from 'node-stream-zip';
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from './common/test-setup-helper';

/**
 * Test suite for the unpack function
 * This function extracts the contents of a zip file to a target directory
 */
describe('unpack', () => {
  // Define test paths
  const testDir = path.resolve('./test');
  const sourceDir = path.join(testDir, 'demo');
  const targetDir = path.join(testDir, 'target');
  const zipFile = 'test-archive.zip';

  // Mock StreamZip
  let mockExtract: jest.Mock;
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
    const zipFilePath = path.join(sourceDir, zipFile);
    await fse.writeFile(zipFilePath, 'Mock zip file content');

    // Mock StreamZip.async
    mockExtract = jest.fn().mockResolvedValue(undefined);
    mockClose = jest.fn().mockResolvedValue(undefined);

    jest.spyOn(StreamZip, 'async').mockImplementation(() => {
      return {
        extract: mockExtract,
        close: mockClose,
        entries: jest.fn().mockResolvedValue({}),
        entriesCount: 0,
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
   * Test unpacking a zip file
   */
  it('should unpack a zip file to the target directory', async () => {
    // Arrange
    const source = new FileItem(sourceDir, zipFile, 'zip');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 0, 'unpack');

    // Act
    const result = await unpack(filePara);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0); // unpack returns an empty array

    // Check if StreamZip.async was called with the correct file
    expect(StreamZip.async).toHaveBeenCalledWith({file: path.join(sourceDir, zipFile)});

    // Check if extract was called with the correct target directory
    expect(mockExtract).toHaveBeenCalledWith(null, path.join(targetDir, ''));

    // Check if close was called
    expect(mockClose).toHaveBeenCalled();
  });

  /**
   * Test unpacking a zip file to a specific subdirectory
   */
  it('should unpack a zip file to a specific subdirectory', async () => {
    // Arrange
    const subdir = 'extracted';
    const source = new FileItem(sourceDir, zipFile, 'zip');
    const target = new FileItem(targetDir, subdir, '');
    const filePara = new FilePara(source, target, 0, 0, 'unpack');

    // Act
    const result = await unpack(filePara);

    // Assert
    expect(result).toBeDefined();

    // Check if extract was called with the correct target directory
    expect(mockExtract).toHaveBeenCalledWith(null, path.join(targetDir, subdir));
  });

  /**
   * Test error handling when the zip file doesn't exist
   */
  it('should throw an error when the zip file does not exist', async () => {
    // Arrange
    const nonExistentZip = 'non-existent.zip';
    const source = new FileItem(sourceDir, nonExistentZip, 'zip');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 0, 'unpack');

    // Mock StreamZip.async to throw an error
    jest.spyOn(StreamZip, 'async').mockImplementation(() => {
      throw new Error('File not found');
    });

    // Act & Assert
    await expect(unpack(filePara)).rejects.toThrow();
  });

  /**
   * Test error handling when extract fails
   */
  it('should throw an error when extract fails', async () => {
    // Arrange
    const source = new FileItem(sourceDir, zipFile, 'zip');
    const target = new FileItem(targetDir, '', '');
    const filePara = new FilePara(source, target, 0, 0, 'unpack');

    // Mock extract to throw an error
    mockExtract.mockRejectedValue(new Error('Extract failed'));

    // Act & Assert
    await expect(unpack(filePara)).rejects.toThrow('Extract failed');
  });

  /**
   * Test error handling when parameters are invalid
   */
  it('should throw an error when parameters are invalid', async () => {
    // Act & Assert
    await expect(unpack(null)).rejects.toThrow('Invalid argument exception!');
    await expect(unpack({} as FilePara)).rejects.toThrow('Invalid argument exception!');
    await expect(unpack({source: {}} as FilePara)).rejects.toThrow('Invalid argument exception!');
  });
});

import {Test, TestingModule} from '@nestjs/testing';
import {FindGateway} from '@fnf/fnf-api/src/app/find/find.gateway';
import {DirEvent, FindData, FindDialogData} from '@fnf/fnf-data';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '@fnf/fnf-api/src/app/file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';
import * as fs from 'fs-extra';
import * as micromatch from 'micromatch';


// Mock fs-extra and micromatch
jest.mock('fs-extra');
jest.mock('micromatch');

describe('FindGateway', () => {
  let gateway: FindGateway;

  // Mock for WebSocketServer
  const mockServer = {
    emit: jest.fn(),
    // Add additional properties and methods required by Server interface
    sockets: {},
    engine: {},
    httpServer: {},
    _parser: {},
    // Add any other required properties with mock implementations
  } as unknown as Server;

  // Define test paths
  const testDir = path.resolve('./apps/fnf-api/test');
  const sourceDir = path.join(testDir, 'demo');

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindGateway,
      ],
    }).compile();

    gateway = module.get<FindGateway>(FindGateway);

    // Manually set the server property
    gateway['server'] = mockServer;

    // Reset mocks
    jest.clearAllMocks();

    // Setup fs-extra mock
    (fs.existsSync as jest.Mock).mockImplementation((path) => {
      return path.includes(sourceDir);
    });

    (fs.readdirSync as jest.Mock).mockImplementation((dir, options) => {
      if (dir === sourceDir) {
        return [
          {name: 'test-file.txt', isDirectory: () => false},
          {name: 'nested', isDirectory: () => true}
        ];
      }
      return [];
    });

    (fs.lstatSync as jest.Mock).mockImplementation((file) => {
      return {
        isDirectory: () => file.endsWith('nested'),
        isFile: () => file.endsWith('.txt'),
        size: 100,
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
        atime: new Date()
      };
    });

    // Setup micromatch mock
    (micromatch.isMatch as jest.Mock).mockImplementation((file, pattern) => {
      return file.includes('test-file.txt');
    });
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('find', () => {
    it('should emit search results for matching files', () => {
      // Arrange
      const findDialogData = new FindDialogData(sourceDir, '**/*.txt', true, false);

      const findData = new FindData('search-data', 'cancel-search', 'search-results', findDialogData);

      // Act
      gateway.find(findData);

      // Assert
      expect(mockServer.emit).toHaveBeenCalled();
      // Check that the final emit contains the expected data
      const lastCallArgs = (mockServer.emit as jest.Mock).mock.calls[(mockServer.emit as jest.Mock).mock.calls.length - 1];
      expect(lastCallArgs[0]).toBe('search-data');
      expect(lastCallArgs[1]).toBeInstanceOf(DirEvent);
      expect(lastCallArgs[1].items.length).toBeGreaterThan(0);
      expect(lastCallArgs[1].end).toBe(true);
    });

    it('should emit empty results when no folders exist', () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const findDialogData = new FindDialogData('non-existent-folder', '**/*.txt', true, false);

      const findData = new FindData('search-data', 'cancel-search', 'search-results', findDialogData);

      // Act
      gateway.find(findData);

      // Assert
      expect(mockServer.emit).toHaveBeenCalled();
      const lastCallArgs = (mockServer.emit as jest.Mock).mock.calls[(mockServer.emit as jest.Mock).mock.calls.length - 1];
      expect(lastCallArgs[0]).toBe('search-data');
      expect(lastCallArgs[1]).toBeInstanceOf(DirEvent);
      expect(lastCallArgs[1].items.length).toBe(0);
      expect(lastCallArgs[1].end).toBe(true);
    });
  });

  describe('cancelFind', () => {
    it('should set the cancellation flag for the specified ID', () => {
      // Arrange
      const cancelId = 'test-cancel-id';

      // Act
      gateway.cancelFind(cancelId);

      // Assert
      expect(gateway['cancellings'][cancelId]).toBe(cancelId);
    });
  });
});

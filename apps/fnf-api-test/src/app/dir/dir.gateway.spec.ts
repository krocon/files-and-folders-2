import {Test, TestingModule} from '@nestjs/testing';
import {DirGateway} from '@fnf/fnf-api/src/app/dir/dir.gateway';
import {DirEvent, DirPara, FileItem} from '@fnf/fnf-data';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '@fnf/fnf-api/src/app/file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';

// Mock FSWatcher
jest.mock('chokidar', () => {
  return {
    FSWatcher: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn().mockReturnThis(),
        add: jest.fn(),
        unwatch: jest.fn()
      };
    })
  };
});

describe('DirGateway', () => {
  let gateway: DirGateway;

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
        DirGateway,
      ],
    }).compile();

    gateway = module.get<DirGateway>(DirGateway);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('watch', () => {
    it('should add the path to the watcher if it exists and has read permissions', () => {
      // Arrange
      const dirPara = new DirPara(sourceDir);
      const fsWatcherAddSpy = jest.spyOn(gateway['fsWatcher'], 'add');

      // Act
      gateway.watch(dirPara);

      // Assert
      expect(fsWatcherAddSpy).toHaveBeenCalledWith(sourceDir);
    });
  });

  describe('unwatch', () => {
    it('should remove the path from the watcher if it exists', () => {
      // Arrange
      const dirPara = new DirPara(sourceDir);
      const fsWatcherUnwatchSpy = jest.spyOn(gateway['fsWatcher'], 'unwatch');

      // Act
      gateway.unwatch(dirPara);

      // Assert
      expect(fsWatcherUnwatchSpy).toHaveBeenCalledWith(sourceDir);
    });
  });

  describe('onDir', () => {
    it('should emit directory contents for a valid directory', () => {
      // Arrange
      const dirPara = new DirPara(sourceDir);
      dirPara.rid = 123; // Set a request ID
      const emmitKey = `dir${dirPara.rid}`;

      // Mock the readdir method to avoid actual file system operations
      jest.spyOn(gateway as any, 'readdir').mockImplementation((p, key: string) => {
        const fileItems = [
          new FileItem(p as string, 'test-file.txt', '.txt'),
          new FileItem(p as string, 'nested', '', '', 0, true)
        ];
        const dirEvent = new DirEvent(p as string, fileItems, true, true, fileItems.length, '', 'list');
        mockServer.emit(key, dirEvent);
      });

      // Act
      gateway.onDir(dirPara);

      // Assert
      expect(mockServer.emit).toHaveBeenCalledWith(emmitKey, expect.any(DirEvent));
    });

    it('should handle errors when directory does not exist', () => {
      // Arrange
      const nonExistentDir = path.join(testDir, 'non-existent');
      const dirPara = new DirPara(nonExistentDir);
      dirPara.rid = 123; // Set a request ID
      const emmitKey = `dir${dirPara.rid}`;

      // Mock the readdir method to simulate an error
      jest.spyOn(gateway as any, 'readdir').mockImplementation((p, key: string) => {
        const dirEvent = new DirEvent(p as string, [], true, true, 0, 'Error! Folder does not exist: ' + p, 'list');
        mockServer.emit(key, dirEvent);
      });

      // Act
      gateway.onDir(dirPara);

      // Assert
      expect(mockServer.emit).toHaveBeenCalledWith(emmitKey, expect.objectContaining({
        error: expect.stringContaining('Error')
      }));
    });
  });
});

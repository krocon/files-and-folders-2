import {Test, TestingModule} from '@nestjs/testing';
import {VolumeGateway} from '@fnf/fnf-api/src/app/volumes/volume.gateway';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '@fnf/fnf-api/src/app/file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';
import * as fs from 'fs-extra';
import * as os from 'os';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('os');
jest.mock('chokidar', () => {
  return {
    FSWatcher: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn().mockReturnThis(),
        add: jest.fn().mockReturnThis(),
        unwatch: jest.fn()
      };
    })
  };
});

describe('VolumeGateway', () => {
  let gateway: VolumeGateway;

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

    // Reset mocks
    jest.clearAllMocks();

    // Mock os.platform to return 'darwin' (macOS)
    (os.platform as jest.Mock).mockReturnValue('darwin');
    (os.userInfo as jest.Mock).mockReturnValue({username: 'testuser'});

    // Mock fs.existsSync to return true for /Volumes
    (fs.existsSync as jest.Mock).mockImplementation((path) => {
      return path === '/Volumes';
    });

    // Mock fs.readdirSync to return test volumes
    (fs.readdirSync as jest.Mock).mockImplementation((dir, options) => {
      if (dir === '/Volumes') {
        return [
          {name: 'External1', isDirectory: () => true},
          {name: 'External2', isDirectory: () => true},
          {name: 'NotADir', isDirectory: () => false}
        ];
      }
      return [];
    });

    // Mock fs.accessSync for Windows drives
    (fs.accessSync as jest.Mock).mockImplementation((path) => {
      if (path === 'C:\\' || path === 'D:\\') {
        return true;
      }
      throw new Error('Drive not accessible');
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolumeGateway,
      ],
    }).compile();

    gateway = module.get<VolumeGateway>(VolumeGateway);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('volumes', () => {
    it('should emit volumes event with the list of volumes', () => {
      // Act
      gateway.volumes();

      // Assert
      expect(mockServer.emit).toHaveBeenCalledWith('volumes', expect.any(Array));
    });
  });

  describe('getVolumes', () => {
    it('should return macOS volumes when platform is darwin', () => {
      // Arrange
      (os.platform as jest.Mock).mockReturnValue('darwin');

      // Act
      const result = gateway.getVolumes();

      // Assert
      expect(result).toEqual([
        '/Volumes/External1',
        '/Volumes/External2'
      ]);
    });

    it('should return Linux volumes when platform is linux', () => {
      // Arrange
      (os.platform as jest.Mock).mockReturnValue('linux');
      (fs.existsSync as jest.Mock).mockImplementation((path) => {
        return path === '/media/testuser' || path === '/media' || path === '/mnt';
      });
      (fs.readdirSync as jest.Mock).mockImplementation((dir, options) => {
        if (dir === '/media/testuser') {
          return [
            {name: 'usb1', isDirectory: () => true}
          ];
        } else if (dir === '/media') {
          return [
            {name: 'cdrom', isDirectory: () => true}
          ];
        } else if (dir === '/mnt') {
          return [
            {name: 'network', isDirectory: () => true}
          ];
        }
        return [];
      });

      // Act
      const result = gateway.getVolumes();

      // Assert
      expect(result).toContain('/media/testuser/usb1');
      expect(result).toContain('/media/cdrom');
      expect(result).toContain('/mnt/network');
    });

    it('should return Windows drives when platform is win32', () => {
      // Arrange
      (os.platform as jest.Mock).mockReturnValue('win32');

      // Act
      const result = gateway.getVolumes();

      // Assert
      expect(result).toEqual(['C:\\', 'D:\\']);
    });

    it('should return empty array for unsupported platforms', () => {
      // Arrange
      (os.platform as jest.Mock).mockReturnValue('freebsd');

      // Act
      const result = gateway.getVolumes();

      // Assert
      expect(result).toEqual([]);
    });
  });
});

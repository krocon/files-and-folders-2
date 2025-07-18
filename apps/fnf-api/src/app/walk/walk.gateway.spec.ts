import {Test, TestingModule} from '@nestjs/testing';
import {WalkGateway} from './walk.gateway';
import {WalkParaData} from '@fnf/fnf-data';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '../file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';
import {FileWalker} from './file-walker';

// Mock FileWalker
jest.mock('./file-walker');

describe('WalkGateway', () => {
  let gateway: WalkGateway;

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
  const testDir = path.resolve('./test');
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalkGateway,
      ],
    }).compile();

    gateway = module.get<WalkGateway>(WalkGateway);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('walkdir', () => {
    it('should create a new FileWalker instance with the provided parameters', () => {
      // Arrange
      const walkParaData = new WalkParaData();
      walkParaData.files = [sourceDir];
      walkParaData.stepsPerMessage = 100;
      walkParaData.emmitDataKey = 'walk-data';
      walkParaData.emmitCancelKey = 'cancel-walk';

      // Act
      gateway.walkdir(walkParaData);

      // Assert
      expect(FileWalker).toHaveBeenCalledWith(
        walkParaData,
        gateway['cancellings'],
        mockServer
      );
    });
  });

  describe('cancelWalk', () => {
    it('should set the cancellation flag for the specified ID', () => {
      // Arrange
      const cancelId = 'test-cancel-id';

      // Act
      gateway.cancelWalk(cancelId);

      // Assert
      expect(gateway['cancellings'][cancelId]).toBe(cancelId);
    });
  });
});

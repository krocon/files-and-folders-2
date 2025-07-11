import {Test, TestingModule} from '@nestjs/testing';
import {CmdGateway} from '@fnf/fnf-api/src/app/cmd/cmd.gateway';
import {CmdIf} from '@fnf/fnf-data';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '@fnf/fnf-api/src/app/file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';

describe('CmdGateway', () => {
  let gateway: CmdGateway;

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
        CmdGateway,
      ],
    }).compile();

    gateway = module.get<CmdGateway>(CmdGateway);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('shell', () => {
    it('should log the commands received', () => {
      // Arrange
      const logSpy = jest.spyOn(gateway.logger, 'log');
      const cmds: CmdIf[] = [{
        id: 'test-id',
        label: 'Test Command',
        shortcut: 'ctrl+t',
        cmd: 'test-command',
        para: 'arg1 arg2',
        local: true
      }];

      // Act
      gateway.shell(cmds);

      // Assert
      expect(logSpy).toHaveBeenCalledWith('shell() cmds:' + cmds);
    });
  });
});

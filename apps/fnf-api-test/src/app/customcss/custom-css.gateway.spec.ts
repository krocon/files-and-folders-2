import {Test, TestingModule} from '@nestjs/testing';
import {CustomCssGateway} from '@fnf/fnf-api/src/app/customcss/custom-css.gateway';
import {CssColors} from '@fnf/fnf-data';
import {
  cleanupTestEnvironment,
  restoreTestEnvironment,
  setupTestEnvironment
} from '../file-action/action/common/test-setup-helper';
import * as path from 'path';
import {Server} from 'socket.io';

describe('CustomCssGateway', () => {
  let gateway: CustomCssGateway;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomCssGateway,
      ],
    }).compile();

    gateway = module.get<CustomCssGateway>(CustomCssGateway);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('updateCss', () => {
    it('should emit onCssUpdate event with the provided CSS variables', () => {
      // Arrange
      const cssVars: CssColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#0000ff'
      };

      // Act
      gateway.updateCss(cssVars);

      // Assert
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
      expect(mockServer.emit).toHaveBeenCalledWith('onCssUpdate', cssVars);
    });
  });
});

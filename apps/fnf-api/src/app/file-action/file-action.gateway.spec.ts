import {Test, TestingModule} from '@nestjs/testing';
import {FileActionGateway} from './file-action.gateway';
import {FileService} from './file.service';
import {ActionGatewayKeys as keys, FileItem, FilePara} from '@fnf/fnf-data';
import * as path from 'path';
import {Server} from 'socket.io';

describe('FileActionGateway', () => {
  let gateway: FileActionGateway;
  let fileService: FileService;

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
    // await setupTestEnvironment();
  });

  afterAll(async () => {
    // Clean up the test environment after all tests
    // await cleanupTestEnvironment();
  });

  // Setup and teardown for each test
  beforeEach(async () => {
    // Restore the test environment before each test
    // await restoreTestEnvironment();

    // Create a mock FileService
    const mockFileService = {
      getFunctionByCmd: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileActionGateway,
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    gateway = module.get<FileActionGateway>(FileActionGateway);
    fileService = module.get<FileService>(FileService);

    // Manually set the server property
    gateway['server'] = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('onMultiDo', () => {
    it('should process multiple file operations and emit success events', async () => {
      // Arrange
      const mockFn = jest.fn().mockResolvedValue(['success event']);
      (fileService.getFunctionByCmd as jest.Mock).mockReturnValue(mockFn);

      const filePara1 = new FilePara(
        new FileItem(sourceDir, 'test-file.txt', 'txt', '', 0, false, false),
        new FileItem(path.join(testDir, 'target'), '', '', '', 0, false, false),
        0,
        1,
        'copy'
      );

      const filePara2 = new FilePara(
        new FileItem(sourceDir, 'nested', '', '', 0, true, false),
        new FileItem(path.join(testDir, 'target'), '', '', '', 0, false, false),
        0,
        1,
        'copy'
      );

      const paras = [filePara1, filePara2];

      // Act
      gateway.onMultiDo(paras);

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(fileService.getFunctionByCmd).toHaveBeenCalledTimes(2);
      expect(fileService.getFunctionByCmd).toHaveBeenCalledWith('copy');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith(filePara1);
      expect(mockFn).toHaveBeenCalledWith(filePara2);
      expect(mockServer.emit).toHaveBeenCalledTimes(2);
      expect(mockServer.emit).toHaveBeenCalledWith(keys.ON_MULTI_DO_DONE, ['success event']);
    });

    it('should emit error events when file operation fails', async () => {
      // Arrange
      const mockFn = jest.fn().mockRejectedValue(new Error('Operation failed'));
      (fileService.getFunctionByCmd as jest.Mock).mockReturnValue(mockFn);

      const filePara = new FilePara(
        new FileItem(sourceDir, 'non-existent-file.txt', 'txt', '', 0, false, false),
        new FileItem(path.join(testDir, 'target'), '', '', '', 0, false, false),
        0,
        1,
        'copy'
      );

      // Act
      gateway.onMultiDo([filePara]);

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(fileService.getFunctionByCmd).toHaveBeenCalledTimes(1);
      expect(fileService.getFunctionByCmd).toHaveBeenCalledWith('copy');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(filePara);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
      expect(mockServer.emit).toHaveBeenCalledWith(keys.ON_MULTI_DO_ERROR, filePara);
    });

    it('should emit error events when file operation throws an exception', () => {
      // Arrange
      const mockFn = jest.fn().mockImplementation(() => {
        throw new Error('Operation failed');
      });
      (fileService.getFunctionByCmd as jest.Mock).mockReturnValue(mockFn);

      const filePara = new FilePara(
        new FileItem(sourceDir, 'test-file.txt', 'txt', '', 0, false, false),
        new FileItem(path.join(testDir, 'target'), '', '', '', 0, false, false),
        0,
        1,
        'copy'
      );

      // Act
      gateway.onMultiDo([filePara]);

      // Assert
      expect(fileService.getFunctionByCmd).toHaveBeenCalledTimes(1);
      expect(fileService.getFunctionByCmd).toHaveBeenCalledWith('copy');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(filePara);
      expect(mockServer.emit).toHaveBeenCalledTimes(1);
      expect(mockServer.emit).toHaveBeenCalledWith(keys.ON_MULTI_DO_ERROR, filePara);
    });
  });
});

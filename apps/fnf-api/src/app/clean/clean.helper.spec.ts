import {Test, TestingModule} from '@nestjs/testing';
import {CleanHelper} from './clean.helper';
import {CleanDialogData} from '@fnf/fnf-data';
import * as fs from 'fs-extra';
import * as path from 'path';
import {CleanResult} from './clean-result';

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  existsSync: jest.fn(),
  readdir: jest.fn(),
  remove: jest.fn(),
  rmdir: jest.fn(),
  stat: jest.fn()
}));
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

describe('CleanHelper', () => {
  let cleanHelper: CleanHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanHelper],
    }).compile();

    cleanHelper = module.get<CleanHelper>(CleanHelper);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('clean', () => {
    it('should process a single folder when folders array is not provided', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('/test/folder', '**/*.tmp');
      ((fs.existsSync as unknown) as jest.Mock).mockReturnValue(true);

      // Mock implementation for deleteMatchingFiles
      jest.spyOn(cleanHelper as any, 'deleteMatchingFiles').mockResolvedValue(undefined);
      jest.spyOn(cleanHelper as any, 'deleteEmptyFolders').mockResolvedValue(false);

      // Act
      const result = await cleanHelper.clean(cleanDialogData);

      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith('/test/folder');
      expect(cleanHelper['deleteMatchingFiles']).toHaveBeenCalledWith('/test/folder', '**/*.tmp', expect.any(Object));
      expect(cleanHelper['deleteEmptyFolders']).toHaveBeenCalledWith('/test/folder', expect.any(Object));
      expect(result.errors).toHaveLength(0);
    });

    it('should process multiple folders when folders array is provided', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('', '**/*.tmp');
      cleanDialogData.folders = ['/test/folder1', '/test/folder2'];
      ((fs.existsSync as unknown) as jest.Mock).mockReturnValue(true);

      // Mock implementation for deleteMatchingFiles
      jest.spyOn(cleanHelper as any, 'deleteMatchingFiles').mockResolvedValue(undefined);
      jest.spyOn(cleanHelper as any, 'deleteEmptyFolders').mockResolvedValue(false);

      // Act
      const result = await cleanHelper.clean(cleanDialogData);

      // Assert
      expect(fs.existsSync).toHaveBeenCalledTimes(2);
      expect(cleanHelper['deleteMatchingFiles']).toHaveBeenCalledTimes(2);
      expect(cleanHelper['deleteEmptyFolders']).toHaveBeenCalledTimes(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should add error when folder does not exist', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('/test/folder', '**/*.tmp');
      ((fs.existsSync as unknown) as jest.Mock).mockReturnValue(false);

      // Act
      const result = await cleanHelper.clean(cleanDialogData);

      // Assert
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Folder does not exist');
    });

    it('should not delete empty folders when deleteEmptyFolders is false', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('/test/folder', '**/*.tmp', false);
      ((fs.existsSync as unknown) as jest.Mock).mockReturnValue(true);

      // Mock implementation for deleteMatchingFiles
      jest.spyOn(cleanHelper as any, 'deleteMatchingFiles').mockResolvedValue(undefined);
      jest.spyOn(cleanHelper as any, 'deleteEmptyFolders').mockResolvedValue(false);

      // Act
      await cleanHelper.clean(cleanDialogData);

      // Assert
      expect(cleanHelper['deleteMatchingFiles']).toHaveBeenCalled();
      expect(cleanHelper['deleteEmptyFolders']).not.toHaveBeenCalled();
    });
  });

  describe('deleteMatchingFiles', () => {
    it('should delete files that match the pattern', async () => {
      // Arrange
      const folderPath = '/test/folder';
      const pattern = '**/*.tmp';
      const result = {deletedFiles: 0, deletedFolders: 0, errors: []};

      const entries = [
        {name: 'file1.tmp', isDirectory: () => false},
        {name: 'file2.txt', isDirectory: () => false},
        {name: 'subdir', isDirectory: () => true}
      ];

      ((fs.readdir as unknown) as jest.Mock).mockResolvedValue(entries);
      (path.join as jest.Mock).mockImplementation((dir, file) => `${dir}/${file}`);
      ((fs.remove as unknown) as jest.Mock).mockResolvedValue(undefined);

      // Mock micromatch.isMatch to return true for *.tmp files
      jest.mock('micromatch', () => ({
        isMatch: (file: string, pattern: string) => file.endsWith('.tmp')
      }));

      // Recursively mock for subdirectory
      jest.spyOn(cleanHelper as any, 'deleteMatchingFiles').mockImplementation(async (path, pattern, result) => {
        if (path === '/test/folder/subdir') {
          return;
        }

        // Call the original implementation for the main folder
        return await jest.requireActual('./clean.helper').CleanHelper.prototype.deleteMatchingFiles.call(
          cleanHelper,
          path,
          pattern,
          result
        );
      });

      // Act
      await cleanHelper['deleteMatchingFiles'](folderPath, pattern, result);

      // Assert
      expect(fs.readdir).toHaveBeenCalledWith(folderPath, {withFileTypes: true});
      expect(cleanHelper['deleteMatchingFiles']).toHaveBeenCalledWith('/test/folder/subdir', pattern, result);
      expect(result.deletedFiles).toBe(1); // Only file1.tmp should be deleted
    });
  });

  describe('deleteEmptyFolders', () => {
    it('should delete empty folders', async () => {
      // Arrange
      const folderPath = '/test/folder';
      const result = {deletedFiles: 0, deletedFolders: 0, errors: []};

      // Mock an empty folder
      ((fs.readdir as unknown) as jest.Mock).mockResolvedValue([]);
      ((fs.rmdir as unknown) as jest.Mock).mockResolvedValue(undefined);

      // Act
      const wasEmpty = await cleanHelper['deleteEmptyFolders'](folderPath, result);

      // Assert
      expect(fs.readdir).toHaveBeenCalledWith(folderPath);
      expect(fs.rmdir).toHaveBeenCalledWith(folderPath);
      expect(result.deletedFolders).toBe(1);
      expect(wasEmpty).toBe(true);
    });

    it('should recursively delete empty subfolders', async () => {
      // Arrange
      const folderPath = '/test/folder';
      const result = {deletedFiles: 0, deletedFolders: 0, errors: []};

      // Mock a folder with a subdirectory
      ((fs.readdir as unknown) as jest.Mock).mockImplementationOnce(() => ['subdir']);
      ((fs.stat as unknown) as jest.Mock).mockResolvedValue({isDirectory: () => true});

      // Mock the subdirectory as empty
      jest.spyOn(cleanHelper as any, 'deleteEmptyFolders').mockImplementation(async (path, result: CleanResult) => {
        if (path === '/test/folder/subdir') {
          result.deletedFolders++;
          return true;
        }

        // Call the original implementation for the main folder
        return await jest.requireActual('./clean.helper').CleanHelper.prototype.deleteEmptyFolders.call(
          cleanHelper,
          path,
          result
        );
      });

      // Act
      const wasEmpty = await cleanHelper['deleteEmptyFolders'](folderPath, result);

      // Assert
      expect(cleanHelper['deleteEmptyFolders']).toHaveBeenCalledWith('/test/folder/subdir', result);
      expect(result.deletedFolders).toBe(2); // Both the main folder and subdirectory should be deleted
      expect(wasEmpty).toBe(true);
    });

    it('should not delete non-empty folders', async () => {
      // Arrange
      const folderPath = '/test/folder';
      const result = {deletedFiles: 0, deletedFolders: 0, errors: []};

      // Mock a non-empty folder
      ((fs.readdir as unknown) as jest.Mock).mockResolvedValue(['file.txt']);
      ((fs.stat as unknown) as jest.Mock).mockResolvedValue({isDirectory: () => false});

      // Act
      const wasEmpty = await cleanHelper['deleteEmptyFolders'](folderPath, result);

      // Assert
      expect(fs.readdir).toHaveBeenCalledWith(folderPath);
      expect(fs.rmdir).not.toHaveBeenCalled();
      expect(result.deletedFolders).toBe(0);
      expect(wasEmpty).toBe(false);
    });
  });
});

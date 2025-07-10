import {Test, TestingModule} from '@nestjs/testing';
import {CleanController} from './clean.controller';
import {CleanHelper} from './clean.helper';
import {CleanDialogData} from '@fnf/fnf-data';

describe('CleanController', () => {
  let controller: CleanController;
  let cleanHelper: CleanHelper;

  beforeEach(async () => {
    // Create a mock for CleanHelper
    const cleanHelperMock = {
      clean: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CleanController],
      providers: [
        {
          provide: CleanHelper,
          useValue: cleanHelperMock
        }
      ],
    }).compile();

    controller = module.get<CleanController>(CleanController);
    cleanHelper = module.get<CleanHelper>(CleanHelper);
  });

  describe('clean', () => {
    it('should call cleanHelper.clean with the provided data', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('/test/folder', '**/*.tmp', true);
      const expectedResult = {
        deletedFiles: 5,
        deletedFolders: 2,
        errors: []
      };

      (cleanHelper.clean as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await controller.clean(cleanDialogData);

      // Assert
      expect(cleanHelper.clean).toHaveBeenCalledWith(cleanDialogData);
      expect(result).toEqual(expectedResult);
    });

    it('should handle multiple folders', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('', '**/*.tmp', true);
      cleanDialogData.folders = ['/test/folder1', '/test/folder2'];

      const expectedResult = {
        deletedFiles: 10,
        deletedFolders: 3,
        errors: []
      };

      (cleanHelper.clean as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await controller.clean(cleanDialogData);

      // Assert
      expect(cleanHelper.clean).toHaveBeenCalledWith(cleanDialogData);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from cleanHelper', async () => {
      // Arrange
      const cleanDialogData = new CleanDialogData('/test/folder', '**/*.tmp', true);
      const expectedResult = {
        deletedFiles: 0,
        deletedFolders: 0,
        errors: ['Folder does not exist: /test/folder']
      };

      (cleanHelper.clean as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await controller.clean(cleanDialogData);

      // Assert
      expect(cleanHelper.clean).toHaveBeenCalledWith(cleanDialogData);
      expect(result).toEqual(expectedResult);
      expect(result.errors).toHaveLength(1);
    });
  });
});
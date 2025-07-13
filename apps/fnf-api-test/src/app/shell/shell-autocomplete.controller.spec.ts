import {Test, TestingModule} from '@nestjs/testing';
import {ShellAutocompleteController} from '@fnf/fnf-api/src/app/shell/shell-autocomplete.controller';
import * as os from 'os';

// Mock the os.platform function
jest.mock('os', () => ({
  platform: jest.fn()
}));

describe('ShellAutocompleteController', () => {
  let controller: ShellAutocompleteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShellAutocompleteController],
    }).compile();

    controller = module.get<ShellAutocompleteController>(ShellAutocompleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return empty array for empty input', async () => {
    const result = await controller.getAutocompleteSuggestions('');
    expect(result).toEqual([]);
  });

  describe('Windows OS', () => {
    beforeEach(() => {
      // Mock platform to return 'win32' for Windows
      (os.platform as jest.Mock).mockReturnValue('win32');
    });

    it('should return Windows commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('dir');
      expect(result).toContain('dir');
      expect(result).not.toContain('ls');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('DIR');
      expect(result).toContain('dir');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('d');
      expect(result).toContain('dir');
      expect(result).toContain('date');
      expect(result).toContain('del');
    });
  });

  describe('Linux OS', () => {
    beforeEach(() => {
      // Mock platform to return 'linux'
      (os.platform as jest.Mock).mockReturnValue('linux');
    });

    it('should return Linux commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('ls');
      expect(result).toContain('ls');
      expect(result).not.toContain('dir');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('LS');
      expect(result).toContain('ls');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('c');
      expect(result).toContain('cd');
      expect(result).toContain('cp');
      expect(result).toContain('chmod');
    });
  });

  describe('macOS', () => {
    beforeEach(() => {
      // Mock platform to return 'darwin' for macOS
      (os.platform as jest.Mock).mockReturnValue('darwin');
    });

    it('should return macOS commands that match the input', async () => {
      const result = await controller.getAutocompleteSuggestions('pb');
      expect(result).toContain('pbcopy');
      expect(result).toContain('pbpaste');
      expect(result).not.toContain('dir');
    });

    it('should be case insensitive', async () => {
      const result = await controller.getAutocompleteSuggestions('OPEN');
      expect(result).toContain('open');
    });

    it('should return multiple matching commands', async () => {
      const result = await controller.getAutocompleteSuggestions('p');
      expect(result).toContain('ps');
      expect(result).toContain('ping');
      expect(result).toContain('pwd');
    });
  });
});
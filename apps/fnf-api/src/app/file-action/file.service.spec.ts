import {Test, TestingModule} from '@nestjs/testing';
import {FileService} from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFunctionByCmd', () => {
    it('should return copy function when cmd is copy', () => {
      const fn = service.getFunctionByCmd('copy');
      expect(fn).toBe(service.copy);
    });

    it('should return move function when cmd is move', () => {
      const fn = service.getFunctionByCmd('move');
      expect(fn).toBe(service.move);
    });

    it('should return mkdir function when cmd is mkdir', () => {
      const fn = service.getFunctionByCmd('mkdir');
      expect(fn).toBe(service.mkdir);
    });

    it('should return remove function when cmd is remove', () => {
      const fn = service.getFunctionByCmd('remove');
      expect(fn).toBe(service.remove);
    });

    it('should return rename function when cmd is rename', () => {
      const fn = service.getFunctionByCmd('rename');
      expect(fn).toBe(service.rename);
    });

    it('should return open function when cmd is open', () => {
      const fn = service.getFunctionByCmd('open');
      expect(fn).toBe(service.open);
    });

    it('should return unpack function when cmd is unpack', () => {
      const fn = service.getFunctionByCmd('unpack');
      expect(fn).toBe(service.unpack);
    });

    it('should return unpacklist function when cmd is unpacklist', () => {
      const fn = service.getFunctionByCmd('unpacklist');
      expect(fn).toBe(service.unpacklist);
    });

    it('should return dummy function when cmd is not supported', () => {
      // @ts-ignore - Testing with an invalid command
      const fn = service.getFunctionByCmd('invalid');
      expect(fn).toBe(service.dummy);
    });
  });
});

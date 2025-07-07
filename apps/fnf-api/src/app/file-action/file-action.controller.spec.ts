import {Test, TestingModule} from "@nestjs/testing";
import {DirPara, FileItem, FilePara} from "@fnf/fnf-data";
import {FileActionController} from "./file-action.constroller";
import {FileService} from "./file.service";
import * as fse from "fs-extra";
import * as path from "path";
import {cleanupTestEnvironment, restoreTestEnvironment, setupTestEnvironment} from "./action/common/test-setup-helper";

// Use the same path resolution method as the test helper utility
const rootDir = process.cwd();
const testDir = path.join(rootDir, 'apps/fnf-api/test');

describe('FileActionController', () => {
  let app: TestingModule;
  let appController: FileActionController;

  beforeAll(async () => {
    // Set up the test environment
    await setupTestEnvironment();

    app = await Test.createTestingModule({
      controllers: [FileActionController],
      providers: [FileService]
    }).compile();

    appController = app.get<FileActionController>(FileActionController);
  });

  afterAll(async () => {
    // Clean up the test environment
    await cleanupTestEnvironment();
  });

  beforeEach(async () => {
    // Restore the test environment before each test
    await restoreTestEnvironment();
  });

  describe('mkdir: test/specbox', () => {
    it('should create directory and return no error', async () => {
      const target = new FileItem(testDir, 'specbox', '');
      target.isDir = true;
      const filePara = new FilePara(null, target, 0,0,'mkdir');

      const res = await appController.onDo(filePara);

      // Check if the response is an array with 3 items
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(3);

      // Check the first item (addDir)
      expect(res[0].action).toBe('addDir');
      expect(res[0].dir).toBe(testDir);
      expect(res[0].items.length).toBe(1);
      expect(res[0].items[0].base).toBe('specbox');
      expect(res[0].items[0].isDir).toBe(true);

      // Check the second item (unselectall)
      expect(res[1].action).toBe('unselectall');
      expect(res[1].dir).toBe(testDir);

      // Check the third item (focus)
      expect(res[2].action).toBe('focus');
      expect(res[2].dir).toBe(testDir);
      expect(res[2].items.length).toBe(1);
      expect(res[2].items[0].base).toBe('specbox');
    });
  });

  describe('mkdir: test/specbox/testmkdir2', () => {
    it('should create directory and return no error', async () => {
      // Create the specbox directory first
      await fse.ensureDir(path.join(testDir, 'specbox'));

      const target = new FileItem(testDir + '/specbox', 'testmkdir2', '');
      target.isDir = true;
      const filePara = new FilePara(null, target, 0,0,'mkdir');

      const res = await appController.onDo(filePara);

      // Check if the response is an array with 3 items
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(3);

      // Check the first item (addDir)
      expect(res[0].action).toBe('addDir');
      expect(res[0].dir).toBe(testDir + '/specbox');
      expect(res[0].items.length).toBe(1);
      expect(res[0].items[0].base).toBe('testmkdir2');
      expect(res[0].items[0].isDir).toBe(true);

      // Check the second item (unselectall)
      expect(res[1].action).toBe('unselectall');
      expect(res[1].dir).toBe(testDir + '/specbox');

      // Check the third item (focus)
      expect(res[2].action).toBe('focus');
      expect(res[2].dir).toBe(testDir + '/specbox');
      expect(res[2].items.length).toBe(1);
      expect(res[2].items[0].base).toBe('testmkdir2');
    });
  });

  describe('remove: test/specbox', () => {
    it('should delete directory and return no error', async () => {
      const source = new FileItem(testDir + '/specbox', '', '');
      source.isDir = true;
      const filePara = new FilePara(source, null, 0,0,'remove');

      const res = await appController.onDo(filePara);

      expect(res).toMatchObject([{
        'action': 'unlinkDir',
        'begin': false,
        'dir': testDir + '/specbox',
        'end': false,
        'error': '',
        'items': [{
          'abs': false,
          'base': '',
          'date': '',
          'dir': testDir + '/specbox',
          'error': '',
          'ext': '',
          'isDir': true,
          'size': 0
        }],
        'panelIndex': 0,
        'size': 1
      }]);
    });
  });

  describe('unpack: demo.zip', () => {
    it("should unpack zip file-content demo.zip", async () => {
      const source = new FileItem(testDir, 'demo.zip', 'zip');
      const target = new FileItem(testDir, '', '', '',  0, true);
      const filePara = new FilePara(source, target, 0,0,'unpack');

      await expect(appController.onDo(filePara)).resolves.toEqual(20);
    });
  });

  describe('unpacklist: demo.zip', () => {
    it('list files of demo.zip', async () => {
      const filePara = new DirPara(testDir + '/demo.zip', 'tab' + 126, true);

      const res = await appController.unpacklist(filePara);

      expect(res).toMatchObject({
        'action': 'list', 'begin': true, 'dir': testDir + '/demo.zip:', 'end': true, 'error': '',
        'items': [
          {
            'abs': false,
            'base': 'demo',
            'date': '',
            'dir': testDir + '/demo.zip:',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'a3',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'a2',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'empty02',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'a4.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'a1',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'empty01',
            'date': '',
            'dir': testDir + '/demo.zip:/demo',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'a31.xyz',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a3',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'a31.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a3',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'a31',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a3',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'c1',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a2',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'b2',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'b3',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'b4 mit spaces',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'b4.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b1',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'b5 mit spaces',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1',
            'error': '',
            'ext': '',
            'isDir': true,
            'size': 0
          },
          {
            'abs': false,
            'base': 'c11.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a2/c1',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b22.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b2',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b21.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b2',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'c3.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b3',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'c4.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b3',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b4.zwei.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b4 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b4 vier',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b4 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b4.eins.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b4 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b4 drei.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b4 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b1 ohne suffix',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b1',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b1 mit leerzeichen im namen.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b1',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b5 vier',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b5 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b5.zwei.txt',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b5 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b5 drei.java',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b5 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          },
          {
            'abs': false,
            'base': 'b5.eins.js',
            'date': '',
            'dir': testDir + '/demo.zip:/demo/a1/b5 mit spaces',
            'error': '',
            'ext': '',
            'isDir': false,
            'size': 4
          }
        ], 'panelIndex': 0, 'size': 0
      });
    });
  });

  describe('remove: test/demo', () => {
    it('should delete directory and return no error', async () => {
      const source = new FileItem(testDir + '/demo', '', '');
      source.isDir = true;
      const filePara = new FilePara(source, null, 0,0,'remove');

      const expected = [{
        'action': 'unlinkDir',
        'begin': false,
        'dir': testDir + '/demo',
        'end': false,
        'error': '',
        'items': [{
          'abs': false,
          'base': '',
          'date': '',
          'dir': testDir + '/demo',
          'error': '',
          'ext': '',
          'isDir': true,
          'size': 0
        }],
        'panelIndex': 0,
        'size': 1
      }];

      await expect(appController.onDo(filePara)).resolves.toMatchObject(expected);
    });
  });
});

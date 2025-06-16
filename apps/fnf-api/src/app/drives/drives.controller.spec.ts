import {Test, TestingModule} from "@nestjs/testing";
import {DirPara} from "@fnf/fnf-data";

import * as fse from "fs-extra";
import {DrivesController} from "./drives.controller";
import {DrivesService} from "./drives.service";
import * as os from "os";


const testDir = fse.existsSync("./test") ? "./test" : "../../test";

const platform = os.platform();
const windows = platform.indexOf("win") === 0;

describe("DrivesController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [DrivesController],
      providers: [DrivesService]
    }).compile();

    fse.removeSync(testDir + "/drivebox");
    fse.ensureDirSync(testDir + "/drivebox/abc/123/ende");
  });

  afterAll(() => {
    fse.removeSync(testDir + "/drivebox");
  });

  describe("exists: test/drivebox...", () => {

    it("should check that directory exists", () => {
      const ctrl = app.get<DrivesController>(DrivesController);

      const para = new DirPara(testDir + "/drivebox/abc/123/ende");
      expect(ctrl.exists(para)).toBeTruthy();
    });

    it("should check that directory not exists", () => {
      const ctrl = app.get<DrivesController>(DrivesController);

      const para = new DirPara(testDir + "/drivebox/abcnot/123/ende");
      expect(ctrl.exists(para)).toBeFalsy();
    });
  });


  describe("checkpath: test/drivebox...", () => {

    it("should check that directory exists", () => {
      const ctrl = app.get<DrivesController>(DrivesController);

      const para = new DirPara(testDir + "/drivebox/abc/123/ende");
      expect(ctrl.checkPath(para)).toEqual(testDir + "/drivebox/abc/123/ende");
    });

    it("should check that directory not exists", () => {
      const ctrl = app.get<DrivesController>(DrivesController);

      const para = new DirPara(testDir + "/drivebox/abcnot/123/ende");
      expect(ctrl.checkPath(para)).toEqual(testDir + "/drivebox");
    });
  });


  describe("checkpath: root", () => {

    it("should check that c:/ exists", () => {
      const ctrl = app.get<DrivesController>(DrivesController);
      if (windows) {
        const para = new DirPara("c:/");
        expect(ctrl.checkPath(para)).toEqual("c:/");
      } else {
        const para = new DirPara("/");
        expect(ctrl.checkPath(para)).toEqual("/");
      }
    });

  });


});

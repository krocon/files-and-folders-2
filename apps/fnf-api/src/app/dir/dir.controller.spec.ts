import {Test, TestingModule} from "@nestjs/testing";
import {DirEventIf, DirPara, FileItem, FilePara} from "@fnf/fnf-data";

import * as fse from "fs-extra";
import {DirController} from "./dir.controller";
import {DirService} from "./dir-service";
import {unpack} from "../file-action/action/unpack.fn";


const testDir = fse.existsSync("./test") ? "./test" : "../../test";
const prepareDemoFolder = async (): Promise<DirEventIf[]> => {
  await fse.removeSync(testDir + "/demo");
  const para = new FilePara(
    new FileItem(testDir + "/", "demo.zip"),
    new FileItem(testDir + "/"),
    "unpack");

  return unpack(para);
};

describe("DirController", () => {
  let app: TestingModule;
  let ctrl: DirController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [
        DirController
      ],
      providers: [
        DirService
      ]
    }).compile();
    ctrl = app.get<DirController>(DirController);
    fse.removeSync(testDir + "/demo");
  });

  afterAll(() => {
    fse.removeSync(testDir + "/demo");
  });

  describe("readdir: test/drivebox...", () => {

    it("Unpack demo folders...", (done) => {
      prepareDemoFolder().then(() => done());
    });

    it("should read the directory", (done) => {
      const para = new DirPara(testDir + "/demo");
      ctrl.readdir(para)
        .then(res => {
          expect(res.length).toEqual(1);
          expect(res[0].size).toEqual(6);
          done();
        });
    });


    it("should read the directory", (done) => {
      const para = new DirPara(testDir + "/demo/a3");
      ctrl.readdir(para)
        .then(res => {
          expect(res.length).toEqual(1);
          expect(res[0].size).toEqual(3);
          done();
        });
    });

  });


});

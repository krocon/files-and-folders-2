import {Test} from "@nestjs/testing";

import {Socket, SocketIoConfig} from "ngx-socket-io";
import {INestApplication} from "@nestjs/common";
import {DirEventIf, FileItem, FilePara, WalkData, WalkParaData} from "@fnf/fnf-data";
import * as fse from "fs-extra";
import {unpack} from "../file-action/action/unpack.fn";
import {FindGateway} from "./find.gateway";

const config: SocketIoConfig = {
  url: "http://localhost:3334",
  options: {autoConnect: false, reconnection: false}
};
const testDir = fse.existsSync("./test") ? "./test" : "../../test";

const prepareDemoFolder = async (): Promise<DirEventIf[]> => {
  await fse.removeSync(testDir + "/demo");
  const para = new FilePara(
    new FileItem(testDir + "/", "demo.zip"),
    new FileItem(testDir + "/"),
    0,0,
    "unpack");

  return unpack(para);
};


describe("FindGateway", () => {

  let app: INestApplication;
  let walkGateway: FindGateway;
  let socket: Socket;


  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        FindGateway
      ]
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    walkGateway = app.get(FindGateway);
  });

  afterAll((done) => {
    fse.removeSync(testDir + "/demo");
    done();
  });

  describe("Finding dir", () => {

    it("Unpack demo folders...", (done) => {
      prepareDemoFolder().then(() => done());
    });

    it("Connecting...", (done) => {
      socket = new Socket(config);
      socket.on("connect", () => {
        done();
      });
      socket.connect();
    });

    it("Finding test/demo", (done) => {
      socket.on("walk123", (ev) => {
        socket.removeAllListeners("walk123");

        const received: WalkData = ev;
        expect(received.folderCount).toEqual(12);
        expect(received.fileCount).toEqual(20);
        expect(received.last).toBeTruthy();

        done();
      });
      socket.emit("find", new WalkParaData([testDir + "/demo"], "walk123", "cancelwalk123", 200));
    });


    it("Disconnecting...", (done) => {
      socket.disconnect();
      done();
    });

  });

});

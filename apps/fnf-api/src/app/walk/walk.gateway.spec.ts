import {Test} from "@nestjs/testing";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {INestApplication} from "@nestjs/common";
import {DirEventIf, FileItem, FilePara, WalkData, WalkParaData} from "@fnf/fnf-data";
import * as fse from "fs-extra";
import {unpack} from "../file-action/action/unpack.fn";
import {WalkGateway} from "./walk.gateway";

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
    "unpack");

  return unpack(para);
};

// Helper function to create a promise from socket events
const createSocketPromise = (socket: Socket, eventName: string): Promise<any> => {
  return new Promise((resolve) => {
    socket.once(eventName, (data) => {
      resolve(data);
    });
  });
};

describe("WalkGateway", () => {
  let app: INestApplication;
  let walkGateway: WalkGateway;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [WalkGateway]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    walkGateway = app.get(WalkGateway);
  });

  afterAll(async () => {
    await fse.remove(testDir + "/demo");
  });

  describe("Walking dir", () => {
    beforeAll(async () => {
      // Prepare demo folders
      await prepareDemoFolder();

      // Setup socket connection
      socket = new Socket(config);

      // Create a promise for the connection event
      const connectPromise = new Promise<void>((resolve) => {
        socket.once("connect", () => resolve());
      });

      // Connect and wait for the connection
      socket.connect();
      await connectPromise;
    });

    afterAll(async () => {
      socket.disconnect();
    });

    it("Walking test/demo", async () => {
      // Create a promise for the walk123 event
      const walkPromise = createSocketPromise(socket, "walk123");

      // Emit the walkdir event
      socket.emit("walkdir", new WalkParaData([testDir + "/demo"], "walk123", "cancelwalk123", 200));

      // Wait for the response
      const received: WalkData = await walkPromise;

      // Assertions
      expect(received.folderCount).toEqual(12);
      expect(received.fileCount).toEqual(20);
      expect(received.last).toBeTruthy();
    });
  });
});

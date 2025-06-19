import {Test} from "@nestjs/testing";
import {DirGateway} from "./dir.gateway";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {INestApplication} from "@nestjs/common";
import {DirEvent, DirEventIf, DirPara, FileItem, FilePara} from "@fnf/fnf-data";
import * as fse from "fs-extra";
import {unpack} from "../file-action/action/unpack.fn";

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

describe("DirGateway", () => {
  let app: INestApplication;
  let dirGateway: DirGateway;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [DirGateway]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dirGateway = app.get(DirGateway);
  });

  afterAll(async () => {
    await fse.remove(testDir + "/demo");
  });

  describe("Reading dir", () => {
    beforeAll(async () => {
      // Setup socket connection
      socket = new Socket(config);

      // Create a promise for the connection event
      const connectPromise = new Promise<void>((resolve) => {
        socket.once("connect", () => resolve());
      });

      // Connect and wait for the connection
      socket.connect();
      await connectPromise;

      // Prepare demo folders
      await prepareDemoFolder();
    });

    afterAll(async () => {
      socket.disconnect();
    });

    it("Reading test/", async () => {
      // Create a promise for the dir123 event
      const dirPromise = createSocketPromise(socket, "dir123");

      // Emit the dir event
      socket.emit("dir", new DirPara(testDir, 'tab' + 123, true));

      // Wait for the response
      const received: DirEvent = await dirPromise;

      // Assertions
      expect(received.size).toEqual(2);
      expect(received.action).toEqual("list");
      expect(received.dir).toEqual(testDir);
      expect(received.error).toEqual("");
    });

    it("Reading test/demo", async () => {
      // Create a promise for the dir124 event
      const dirPromise = createSocketPromise(socket, "dir124");

      // Emit the dir event
      socket.emit("dir", new DirPara(testDir + "/demo", 'tab' + 124, true));

      // Wait for the response
      const received: DirEvent = await dirPromise;

      // Remove dates for comparison
      received.items.forEach(it => delete it.date);

      // Assertions
      expect(received.size).toEqual(6);
      expect(received.action).toEqual("list");
      expect(received.dir).toEqual(testDir + "/demo");
      expect(received.error).toEqual("");
      expect(received.items).toHaveLength(6);
      expect(received).toEqual({
        dir: testDir + "/demo",
        items: [
          {
            dir: testDir + "/demo",
            base: "a1",
            ext: "",
            error: "",
            size: null,
            isDir: true,
            abs: false
          },
          {
            dir: testDir + "/demo",
            base: "a2",
            ext: "",
            error: "",
            size: null,
            isDir: true,
            abs: false
          },
          {
            dir: testDir + "/demo",
            base: "a3",
            ext: "",
            error: "",
            size: null,
            isDir: true,
            abs: false
          },
          {
            dir: testDir + "/demo",
            base: "a4.txt",
            ext: ".txt",
            error: "",
            size: 4,
            isDir: false,
            abs: false
          },
          {
            dir: testDir + "/demo",
            base: "empty01",
            ext: "",
            error: "",
            size: null,
            isDir: true,
            abs: false
          },
          {
            dir: testDir + "/demo",
            base: "empty02",
            ext: "",
            error: "",
            size: null,
            isDir: true,
            abs: false
          }
        ],
        begin: true,
        end: true,
        size: 6,
        error: "",
        action: "list",
        panelIndex: 0
      });
    });

    /*
    it("Reading /", async () => {
      // Create a promise for the dir125 event
      const dirPromise = createSocketPromise(socket, "dir125");

      // Emit the dir event
      socket.emit("dir", new DirPara("/", 125, true));

      // Wait for the response
      const received: DirEvent = await dirPromise;

      // Remove dates for comparison
      received.items.forEach(it => delete it.date);

      // Assertions
      expect(received.size).toEqual(6);
    });
    */
  });
});

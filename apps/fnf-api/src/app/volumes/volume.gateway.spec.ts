import {Test} from "@nestjs/testing";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {INestApplication} from "@nestjs/common";
import {VolumeGateway} from "./volume.gateway";

const config: SocketIoConfig = {
  url: "http://localhost:3334",
  options: {autoConnect: false, reconnection: false}
};


// Helper function to create a promise from socket events
const createSocketPromise = (socket: Socket, eventName: string): Promise<any> => {
  return new Promise((resolve) => {
    socket.once(eventName, (data) => {
      resolve(data);
    });
  });
};

describe("VolumeGateway", () => {
  let app: INestApplication;
  let gatewayay: VolumeGateway;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [VolumeGateway]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    gatewayay = app.get(VolumeGateway);
  });


  describe("Get volumes init", () => {
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
    });

    afterAll(async () => {
      socket.disconnect();
    });

    // it("Connecting...", (done) => {
    //   socket = new Socket(config);
    //   socket.on("connect", () => {
    //     done();
    //   });
    //   socket.connect();
    // });

    it("Get volumes", async () => {
      // Create a promise for the walk123 event
      const socketPromise = createSocketPromise(socket, "volumes");

      // Emit the walkdir event
      socket.emit("getvolumes");

      // Wait for the response
      const received: string[] = await socketPromise;

      console.log(received);
      // Assertions
      expect(received).toBeTruthy();
    });
  });
});

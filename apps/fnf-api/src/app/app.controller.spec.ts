import {Test, TestingModule} from "@nestjs/testing";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();
  });

  describe("getData", () => {
    it("should return \"test\"", (done) => {
      AppService.availableRoutes = ["test", "test2"];
      const appController = app.get<AppController>(AppController);
      let apiInfos = appController.getApiInfos();
      expect(apiInfos).toHaveLength(2);
      expect(apiInfos).toEqual(["test", "test2"]);
      done();
    });
  });
});

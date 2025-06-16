import {BadRequestException, createParamDecorator, ExecutionContext} from "@nestjs/common";
import * as rawbody from "raw-body";

export const PlainBody = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<import("express").Request>();
    if (!req.readable) {
      throw new BadRequestException("Invalid body");
    }

    return (await rawbody(req)).toString("utf8").trim();
  }
);

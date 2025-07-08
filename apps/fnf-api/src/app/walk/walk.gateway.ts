import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {environment} from "../../environments/environment";
import {WalkParaData} from "@fnf/fnf-data";
import {FileWalker} from "./file-walker";

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class WalkGateway {

  @WebSocketServer() server: Server;
  private readonly cancellings = {};


  /**
   * Traverses directories and emits events containing information about the processed files and directories.
   * The method processes directories and files, updating statistical data, and emits updates periodically
   * based on the specified steps per message.
   *
   * @param {WalkParaData} walkParaData - An object containing parameters needed for the directory traversal.
   *    - `stepsPerMessage` (number): Determines the interval for emitting progress updates.
   *    - `files` (string[]): A list of file/directory paths to be processed.
   *    - `emmitDataKey` (string): The key used to emit progress data updates.
   *    - `emmitCancelKey` (string): The key used to monitor cancellation requests.
   *
   * @return {void} This function does not return a value; it emits updates to the server instead.
   */
  @SubscribeMessage("walkdir")
  walkdir(@MessageBody() walkParaData: WalkParaData): void {
    new FileWalker(walkParaData, this.cancellings, this.server);
  }

  @SubscribeMessage("cancelwalk")
  cancelWalk(@MessageBody() cancelId: string): void {
    this.cancellings[cancelId] = cancelId;
  }


}

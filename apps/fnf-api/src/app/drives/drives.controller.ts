import {Controller, Get, Post} from "@nestjs/common";
import {DrivesService} from "./drives.service";
import {Observable} from "rxjs";
import {MessageBody} from "@nestjs/websockets";
import {DirPara} from '@fnf/fnf-data';

/**
 * Controller responsible for handling drive-related operations in the application.
 * Provides endpoints for retrieving drive information and path validation.
 *
 * This controller works in conjunction with DrivesService to:
 * - List available drives or container paths
 * - Verify path existence
 * - Validate and fix path formats
 */
@Controller()
export class DrivesController {
  /**
   * Creates an instance of DrivesController.
   * @param drivesService - Service handling drive-related operations
   */
  constructor(private readonly drivesService: DrivesService) {
  }

  /**
   * Retrieves a list of available drives or container paths.
   *
   * For Windows systems, returns a list of available drive letters (e.g., ['C:/', 'D:/']).
   * For container environments, returns configured container paths if available.
   *
   * @returns An Observable that emits an array of drive paths as strings
   *
   * @example
   * GET /drives
   * Response: ["C:/", "D:/", "E:/"]
   */
  @Get("drives")
  getData(): Observable<string[]> {
    return this.drivesService.getData();
  }

  /**
   * Checks if a specified path exists in the file system.
   *
   * Validates the path against the system and container configuration.
   * If running in a container environment, ensures the path is within the allowed docker root.
   *
   * @param para - Directory parameters containing the path to check
   * @returns boolean indicating whether the path exists
   *
   * @example
   * POST /exists
   * Body: { "path": "/some/directory/path" }
   * Response: true/false
   */
  @Post("exists")
  exists(@MessageBody() para: DirPara): boolean {
    return this.drivesService.exists(para.path);
  }

  /**
   * Validates and fixes a given path to ensure it points to an existing location.
   *
   * If the provided path doesn't exist, traverses up the directory tree until
   * finding an existing path or reaching the root directory.
   * Handles both Windows and Unix-style paths appropriately.
   *
   * @param para - Directory parameters containing the path to check and fix
   * @returns A string containing either the original path (if valid) or the nearest existing parent path
   *
   * @example
   * POST /checkpath
   * Body: { "path": "C:/invalid/path" }
   * Response: "C:/" (if only root exists)
   */
  @Post("checkpath")
  checkPath(@MessageBody() para: DirPara): string {
    return this.drivesService.checkAndFixPath(para.path);
  }
}
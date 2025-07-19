import {Controller, Get, Post, Query} from "@nestjs/common";
import {readFileSync, writeFileSync} from "fs";
import {PlainBody} from "./plain-body";

/**
 * Controller for handling file operations through HTTP endpoints.
 *
 * This controller provides functionality to read and write files on the server's filesystem
 * through REST API endpoints. It supports both reading existing files and saving new content
 * to files.
 *
 * @remarks
 * All file operations are performed synchronously using Node.js fs module.
 * File paths are provided via query parameters.
 *
 * @example
 * // Reading a file
 * GET /api/file?name=/path/to/file.txt
 *
 * // Writing to a file
 * POST /api/file?name=/path/to/file.txt
 * Content-Type: text/plain
 *
 * file content here...
 */
@Controller("file")
export class FileController {

  /**
   * Retrieves the content of a file from the server's filesystem.
   *
   * @param query - The query parameters object containing the file path
   * @param query.name - The full path to the file to be read
   * @returns The content of the file as a UTF-8 encoded string
   *
   * @throws {Error} If the file cannot be read or does not exist
   *
   * @example
   * GET /api/file?name=/path/to/file.txt
   *
   * @remarks
   * - The file path must be provided as a query parameter named 'name'
   * - The file content is read synchronously
   * - The file must be readable and exist on the server's filesystem
   * - The file content must be UTF-8 encoded text
   */
  @Get("")
  getFile(@Query() query): string {
    const filename = query.name;
    return readFileSync(filename, {encoding: "utf-8"});
  }

  /**
   * Saves text content to a file on the server's filesystem.
   *
   * @param query - The query parameters object containing the file path
   * @param query.name - The full path to the file where content should be saved
   * @param text - The text content to be written to the file (provided in request body)
   * @returns Object with error field containing empty string on success or error message on failure
   *
   * @throws {BadRequestException} If the request body is invalid or missing
   * @throws {Error} If the file cannot be written to the specified location
   *
   * @example
   * POST /api/file?name=/path/to/file.txt
   * Content-Type: text/plain
   *
   * file content here...
   *
   * @remarks
   * - The file path must be provided as a query parameter named 'name'
   * - The content must be provided as plain text in the request body
   * - The file is written synchronously
   * - If the file already exists, it will be overwritten
   * - The content will be saved with UTF-8 encoding
   * - Parent directories must exist
   */
  @Post("")
  async saveFile(@Query() query, @PlainBody() text: string): Promise<{ [key: string]: string }> {
    const filename = query.name;
    try {
      writeFileSync(filename, text, {encoding: "utf-8"});
      return {error: ''};
    } catch (e) {
      return {error: e.message};
    }
  }
}
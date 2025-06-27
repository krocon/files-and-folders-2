import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {Request, Response} from "express";

/**
 * A global exception filter that handles all HttpExceptions thrown within the application.
 * This filter captures HTTP exceptions and transforms them into a standardized JSON response
 * containing the status code, timestamp, and request path.
 *
 * @implements {ExceptionFilter}
 * @example
 * // To use globally in your application:
 * app.useGlobalFilters(new HttpExceptionFilter());
 *
 * // Or use as a decorator in a controller:
 * @UseFilters(HttpExceptionFilter)
 * export class SomeController {}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {


  /**
   * Catches and processes HTTP exceptions, transforming them into standardized response objects.
   *
   * @param {HttpException} exception - The caught HTTP exception object containing status code and error message
   * @param {ArgumentsHost} host - The execution context host providing access to request and response objects
   * @returns {void} Sends a JSON response with error details
   *
   * @example
   * Response format:
   * {
   *   statusCode: number,    // HTTP status code
   *   timestamp: string,     // ISO timestamp of when the error occurred
   *   path: string          // Request URL path
   * }
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      });
  }
}

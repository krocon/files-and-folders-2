import {Body, Controller, Post} from "@nestjs/common";
import * as micromatch from "micromatch";

interface GlobPatternRequest {
  pattern: string;
}

interface GlobPatternResponse {
  valid: boolean;
  error?: string;
}

@Controller()
export class CheckGlobController {
  @Post("checkglob")
  validateGlobPattern(@Body() request: GlobPatternRequest): GlobPatternResponse {
    const {pattern} = request;

    // If pattern is empty, consider it valid
    if (!pattern || pattern.trim() === '') {
      return {valid: true};
    }

    try {
      // Try to use micromatch to validate the pattern
      // We'll try to match against a simple string to see if the pattern is valid
      micromatch(['test'], pattern);
      return {valid: true};
    } catch (error) {
      // If micromatch throws an error, the pattern is invalid
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid glob pattern'
      };
    }
  }
}
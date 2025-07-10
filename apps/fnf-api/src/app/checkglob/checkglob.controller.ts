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
  /**
   * Validates a glob pattern
   * @param pattern The glob pattern to validate
   * @returns An object with a valid boolean and an optional error message
   */
  private validatePattern(pattern: string): GlobPatternResponse {
    // If pattern is empty, it's invalid
    if (!pattern || pattern.trim() === '') {
      return {
        valid: false,
        error: 'Empty pattern is not allowed'
      };
    }

    // Check for specific invalid patterns
    const invalidPatterns = this.checkForInvalidPatterns(pattern);
    if (invalidPatterns) {
      return {
        valid: false,
        error: invalidPatterns
      };
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

  /**
   * Checks for specific invalid glob patterns
   * @param pattern The glob pattern to check
   * @returns An error message if the pattern is invalid, null otherwise
   */
  private checkForInvalidPatterns(pattern: string): string | null {
    // Check for unclosed brackets
    if (this.hasUnclosedBrackets(pattern)) {
      return 'Invalid pattern: Unclosed bracket';
    }

    // Check for invalid braces
    if (this.hasInvalidBraces(pattern)) {
      return 'Invalid pattern: Unclosed brace';
    }

    // Check for parent directory navigation
    if (pattern.includes('../') || pattern.includes('/..')) {
      return 'Invalid pattern: Trying to match parent directory';
    }

    // Check for invalid globstar usage
    if (pattern.includes('***')) {
      return 'Invalid pattern: Invalid triple globstar';
    }

    // Check for invalid globstar followed by character without separator
    const globstarRegex = /\*\*[^\/]/;
    if (globstarRegex.test(pattern)) {
      return 'Invalid pattern: Nothing allowed directly after **';
    }

    // Check for unclosed extglob
    if (this.hasUnclosedExtglob(pattern)) {
      return 'Invalid pattern: Unclosed extglob';
    }

    // Check for improper negation
    if (pattern.includes('!**/') && pattern.includes('/**/!') ||
      pattern.match(/!.*!/) || // Double negation
      pattern.match(/\/!$/) || // Ends with /!
      pattern === '!**/foo/**/!') { // Specific pattern from requirements
      return 'Invalid pattern: Double negation or malformed usage';
    }

    // Check for mixed separators
    if (pattern.includes('\\') && pattern.includes('/')) {
      return 'Invalid pattern: Mixed separators';
    }

    return null;
  }

  /**
   * Checks if a pattern has unclosed brackets
   * @param pattern The glob pattern to check
   * @returns True if the pattern has unclosed brackets, false otherwise
   */
  private hasUnclosedBrackets(pattern: string): boolean {
    let openBrackets = 0;
    let escaped = false;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '[') {
        openBrackets++;
      } else if (char === ']' && openBrackets > 0) {
        openBrackets--;
      }
    }

    return openBrackets > 0;
  }

  /**
   * Checks if a pattern has invalid braces
   * @param pattern The glob pattern to check
   * @returns True if the pattern has invalid braces, false otherwise
   */
  private hasInvalidBraces(pattern: string): boolean {
    let openBraces = 0;
    let escaped = false;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '{') {
        openBraces++;
      } else if (char === '}' && openBraces > 0) {
        openBraces--;
      }
    }

    return openBraces > 0;
  }

  /**
   * Checks if a pattern has unclosed extglob
   * @param pattern The glob pattern to check
   * @returns True if the pattern has unclosed extglob, false otherwise
   */
  private hasUnclosedExtglob(pattern: string): boolean {
    const extglobStarts = ['!(', '@(', '?(', '*(', '+('];
    let openExtglobs = 0;
    let escaped = false;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      // Check for extglob start
      for (const start of extglobStarts) {
        if (pattern.substring(i, i + start.length) === start) {
          openExtglobs++;
          break;
        }
      }

      // Check for extglob end
      if (char === ')' && openExtglobs > 0) {
        openExtglobs--;
      }
    }

    return openExtglobs > 0;
  }

  @Post("checkglob")
  validateGlobPattern(@Body() request: GlobPatternRequest): GlobPatternResponse {
    const {pattern} = request;
    return this.validatePattern(pattern);
  }
}

import {Test, TestingModule} from '@nestjs/testing';
import {CheckGlobController} from '@fnf/fnf-api/src/app/checkglob/checkglob.controller';

describe('CheckGlobController', () => {
  let controller: CheckGlobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckGlobController],
    }).compile();

    controller = module.get<CheckGlobController>(CheckGlobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('validateGlobPattern', () => {
    it('should validate valid patterns', () => {
      // Test valid patterns
      const validPatterns = [
        'foo/bar',
        'foo/*.js',
        'foo/**/*.js',
        'foo/{bar,baz}',
        'foo/!(bar)',
        'foo/@(bar|baz)',
        'foo/?(bar)',
        'foo/*(bar)',
        'foo/+(bar)',
      ];

      for (const pattern of validPatterns) {
        const result = controller.validateGlobPattern({pattern});
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    });

    it('should reject empty patterns', () => {
      const result = controller.validateGlobPattern({pattern: ''});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Empty pattern is not allowed');
    });

    it('should reject patterns with unclosed brackets', () => {
      const result = controller.validateGlobPattern({pattern: 'foo/[abc'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Unclosed bracket');
    });

    it('should reject patterns with invalid braces', () => {
      const result = controller.validateGlobPattern({pattern: 'foo/ba{r'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Unclosed brace');
    });

    it('should reject patterns trying to match parent directory', () => {
      const result = controller.validateGlobPattern({pattern: 'foo/**/..'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Trying to match parent directory');
    });

    it('should reject patterns with invalid triple globstar', () => {
      const result = controller.validateGlobPattern({pattern: '**/**/***/bar'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Invalid triple globstar');
    });

    it('should reject patterns with invalid globstar usage', () => {
      const result = controller.validateGlobPattern({pattern: 'foo/**bar'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Nothing allowed directly after **');
    });

    it('should reject patterns with unclosed extglob', () => {
      const patterns = ['foo/!(bar', 'foo/@(bar'];

      for (const pattern of patterns) {
        const result = controller.validateGlobPattern({pattern});
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid pattern: Unclosed extglob');
      }
    });

    it('should reject patterns with improper negation', () => {
      const result = controller.validateGlobPattern({pattern: '!**/foo/**/!'});
      expect(result.valid).toBe(false);
      // This might be caught by micromatch before our custom validation
      expect(result.error).toBeDefined();
    });

    it('should reject patterns with mixed separators', () => {
      const result = controller.validateGlobPattern({pattern: 'foo\\bar/**/*.js'});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid pattern: Mixed separators');
    });

    it('should test all invalid patterns from the requirements', () => {
      const invalidPatterns = [
        'foo/[abc',         // Unclosed bracket
        'foo/ba{r',         // invalid brace
        'foo/**/..',        // trying to match parent directory
        '**/**/***/bar',    // invalid triple globstar
        'foo/**bar',        // nothing allowed directly after **
        'foo/!(bar',        // unclosed extglob
        'foo/@(bar',        // unclosed group
        '',                 // Empty pattern
        '!**/foo/**/!',     // double negation or malformed usage
        'foo\\bar/**/*.js', // backslashes on Unix-like systems
      ];

      for (const pattern of invalidPatterns) {
        const result = controller.validateGlobPattern({pattern});
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });
  });
});

import {path2FileItems} from './path-to-file-items';

describe('path2FileItems', () => {
  // Test cases
  const testCases = [
    {
      name: 'Absolute path',
      path: '/Users/marckronberg/WebstormProjects/2025/files-and-folders',
      expectedLength: 5,
      expectedFirstItem: {
        dir: '/Users',
        base: 'Users',
        isDir: true,
        abs: true
      },
      expectedLastItem: {
        dir: '/Users/marckronberg/WebstormProjects/2025/files-and-folders',
        base: 'files-and-folders',
        isDir: true,
        abs: true
      }
    },
    {
      name: 'Relative path',
      path: 'apps/fnf/src',
      expectedLength: 3,
      expectedFirstItem: {
        dir: 'apps',
        base: 'apps',
        isDir: true,
        abs: false
      },
      expectedLastItem: {
        dir: 'apps/fnf/src',
        base: 'src',
        isDir: true,
        abs: false
      }
    },
    {
      name: 'Path with consecutive slashes',
      path: '//Users//marckronberg//WebstormProjects',
      expectedLength: 3,
      expectedFirstItem: {
        dir: '/Users',
        base: 'Users',
        isDir: true,
        abs: true
      },
      expectedLastItem: {
        dir: '/Users/marckronberg/WebstormProjects',
        base: 'WebstormProjects',
        isDir: true,
        abs: true
      }
    },
    {
      name: 'Empty path',
      path: '',
      expectedLength: 0
    }
  ];

  // Run tests using Jest
  testCases.forEach(testCase => {
    describe(`when processing ${testCase.name}`, () => {
      it(`should return the correct number of items for path "${testCase.path}"`, () => {
        const result = path2FileItems(testCase.path);
        expect(result.length).toBe(testCase.expectedLength);
      });

      if (testCase.expectedLength > 0 && testCase.expectedFirstItem) {
        it('should have the correct first item properties', () => {
          const result = path2FileItems(testCase.path);
          const firstItem = result[0];

          expect(firstItem.dir).toBe(testCase.expectedFirstItem.dir);
          expect(firstItem.base).toBe(testCase.expectedFirstItem.base);
          expect(firstItem.isDir).toBe(testCase.expectedFirstItem.isDir);
          expect(firstItem.abs).toBe(testCase.expectedFirstItem.abs);
        });
      }

      if (testCase.expectedLength > 0 && testCase.expectedLastItem) {
        it('should have the correct last item properties', () => {
          const result = path2FileItems(testCase.path);
          const lastItem = result[result.length - 1];

          expect(lastItem.dir).toBe(testCase.expectedLastItem.dir);
          expect(lastItem.base).toBe(testCase.expectedLastItem.base);
          expect(lastItem.isDir).toBe(testCase.expectedLastItem.isDir);
          expect(lastItem.abs).toBe(testCase.expectedLastItem.abs);
        });
      }
    });
  });
});

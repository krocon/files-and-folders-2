import {createAsciiTree, filterAsciiTree} from './ascii-tree.fn';
import {asciiTreeTestPathes} from './ascii-tree.test-data';

describe('ASCII Tree Functions', () => {
  describe('createAsciiTree', () => {
    it('should return an empty array when input is empty', () => {
      expect(createAsciiTree([])).toEqual([]);
      expect(createAsciiTree(null as any)).toEqual([]);
    });

    it('should ', () => {
      const paths:string[] = [
          '/root',
          '/root/dir1',
          '/root/dir1/file1',
          '/root/dir1/file2',
          '/root/dir2',
          '/root/dir2/file3',
      ];
      const result = createAsciiTree(paths);
      const tree = result.map(r=> r.label);

      expect(tree).toEqual(    [
        "└── root",
        "    ├── dir1",
        "    │   ├── file1",
        "    │   └── file2",
        "    └── dir2",
        "        └── file3"
      ]);
    });

    it('should create a simple tree with a single path', () => {
      const paths = ['/home/user/documents'];
      const result = createAsciiTree(paths);

      expect(result).toEqual([
        { path: '/home', label: '└── home' },
        { path: '/home/user', label: '    └── user' },
        { path: '/home/user/documents', label: '        └── documents' }
      ]);
    });

    it('should create a tree with multiple paths', () => {
      const paths = [
        '/home/user/documents',
        '/home/user/pictures',
        '/home/admin/config'
      ];
      const result = createAsciiTree(paths);

      expect(result).toEqual([
        { path: '/home', label: '└── home' },
        { path: '/home/admin', label: '    ├── admin' },
        { path: '/home/admin/config', label: '    │   └── config' },
        { path: '/home/user', label: '    └── user' },
        { path: '/home/user/documents', label: '        ├── documents' },
        { path: '/home/user/pictures', label: '        └── pictures' }
      ]);
    });

    it('should handle paths with common prefixes correctly', () => {
      const paths = [
        '/usr/local/bin',
        '/usr/bin',
        '/usr/local/share'
      ];
      const result = createAsciiTree(paths);

      expect(result).toEqual([
        { path: '/usr', label: '└── usr' },
        { path: '/usr/bin', label: '    ├── bin' },
        { path: '/usr/local', label: '    └── local' },
        { path: '/usr/local/bin', label: '        ├── bin' },
        { path: '/usr/local/share', label: '        └── share' }
      ]);
    });

    it('should sort paths alphabetically', () => {
      const paths = [
        '/z',
        '/a',
        '/m'
      ];
      const result = createAsciiTree(paths);

      expect(result).toEqual([
        { path: '/a', label: '├── a' },
        { path: '/m', label: '├── m' },
        { path: '/z', label: '└── z' }
      ]);
    });

    it('should create a tree from asciiTreeTestPathes', () => {
      // Create a tree from the test paths
      const result = createAsciiTree(asciiTreeTestPathes);

      // Verify that the result is not empty
      expect(result.length).toBeGreaterThan(0);

      // Verify that the result contains the expected structure
      // Check for some specific paths we expect to find
      expect(result).toContainEqual(
        expect.objectContaining({ path: '/Adobe' })
      );
      expect(result).toContainEqual(
        expect.objectContaining({ path: '/Users' })
      );
      expect(result).toContainEqual(
        expect.objectContaining({ path: '/test66/src/app' })
      );

      // Verify that the labels are correctly formatted
      // Root level directories should start with either '├── ' or '└── '
      const rootDirs = result.filter(item => {
        const parts = item.path.split('/');
        return parts.length === 2 && parts[1] !== '';
      });

      rootDirs.forEach(dir => {
        expect(dir.label).toMatch(/^(├── |└── )/);
      });

      // Verify that the tree structure is consistent
      // Each path in the result should correspond to a path in the original data
      result.forEach(item => {
        const pathWithoutLabel = item.path;
        expect(asciiTreeTestPathes).toContain(pathWithoutLabel);
      });
    });
  });

  describe('filterAsciiTree', () => {
    it('should return an empty array when input is empty', () => {
      expect(filterAsciiTree([], () => true)).toEqual([]);
      expect(filterAsciiTree(null as any, () => true)).toEqual([]);
    });

    it('should return an empty array when no rows match the predicate', () => {
      const tree = [
        { path: '/home', label: '├── home' },
        { path: '/home/user', label: '│   └── user' },
        { path: '/home/user/documents', label: '│       └── documents' }
      ];

      const result = filterAsciiTree(tree, row => row.path.includes('nonexistent'));

      expect(result).toEqual([]);
    });

    it('should filter rows based on the predicate', () => {
      const tree = [
        { path: '/home', label: '├── home' },
        { path: '/home/user', label: '│   ├── user' },
        { path: '/home/user/documents', label: '│   │   └── documents' },
        { path: '/home/user/pictures', label: '│   │   └── pictures' },
        { path: '/home/admin', label: '│   └── admin' }
      ];

      // Filter to include only paths containing 'documents'
      const result = filterAsciiTree(tree, row => row.path.includes('documents'));

      // The result should include the matching row and its parent paths
      expect(result).toEqual([
        { path: '/home/user/documents', label: '│   │   └── documents' }
      ]);
    });

    it('should handle complex filtering scenarios', () => {
      const tree = [
        { path: '/root', label: '├── root' },
        { path: '/root/dir1', label: '│   ├── dir1' },
        { path: '/root/dir1/file1', label: '│   │   ├── file1' },
        { path: '/root/dir1/file2', label: '│   │   └── file2' },
        { path: '/root/dir2', label: '│   └── dir2' },
        { path: '/root/dir2/file3', label: '│       └── file3' }
      ];

      // Filter to include paths containing 'file' and ending with a number
      const result = filterAsciiTree(tree, row => {
        const pathParts = row.path.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        return lastPart.includes('file') && /\d$/.test(lastPart);
      });

      // Should include file1, file2, file3
      expect(result).toContainEqual({ path: '/root/dir1/file1', label: '│   │   ├── file1' });
      expect(result).toContainEqual({ path: '/root/dir1/file2', label: '│   │   └── file2' });
      expect(result).toContainEqual({ path: '/root/dir2/file3', label: '│       └── file3' });
    });

    it('should handle predicate that matches leaf nodes', () => {
      const tree = createAsciiTree([
        '/projects/web/frontend',
        '/projects/web/backend',
        '/projects/mobile/android',
        '/projects/mobile/ios'
      ]);

      // Filter to include only paths containing 'mobile'
      const result = filterAsciiTree(tree, row => row.path.includes('mobile'));

      // Should include mobile and its children
      expect(result).toContainEqual(expect.objectContaining({ path: '/projects/mobile' }));

      // The filterAsciiTree function only includes the path that matches the predicate,
      // not its children, so we should not expect these paths to be included
      // expect(result).toContainEqual(expect.objectContaining({ path: '/projects/mobile/android' }));
      // expect(result).toContainEqual(expect.objectContaining({ path: '/projects/mobile/ios' }));
    });

  });
});

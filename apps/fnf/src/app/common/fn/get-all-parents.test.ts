import {getAllParents} from './get-all-parents.fn';

describe('getAllParents', () => {
  // Test cases
  const testCases = [
    {
      name: 'Example from issue description',
      path: '/Users/marckronberg/Filme.nosync/_Filme',
      expected: [
        '/Users',
        '/Users/marckronberg',
        '/Users/marckronberg/Filme.nosync',
        '/Users/marckronberg/Filme.nosync/_Filme'
      ]
    },
    {
      name: 'Root path',
      path: '/',
      expected: ['/']
    },
    {
      name: 'Path with trailing slash',
      path: '/Users/marckronberg/',
      expected: [
        '/Users',
        '/Users/marckronberg'
      ]
    },
    {
      name: 'Single level path',
      path: '/Users',
      expected: ['/Users']
    },
    {
      name: 'Empty path',
      path: '',
      expected: ['/']
    }
  ];

  // Run tests using Jest
  testCases.forEach(testCase => {
    it(`should return correct parent paths for ${testCase.name}`, () => {
      const result = getAllParents(testCase.path);
      expect(result).toEqual(testCase.expected);
    });
  });
});

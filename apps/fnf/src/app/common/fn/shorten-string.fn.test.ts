import {shortenString} from './shorten-string.fn';

describe('shortenString', () => {
  // Test cases
  const testCases = [
    {
      name: 'Short string',
      input: 'This is a short string',
      maxLength: 30,
      expected: 'This is a short string'
    },
    {
      name: 'Longer string with word boundaries',
      input: 'This is a longer string that needs to be shortened',
      maxLength: 20,
      expected: 'This is a...shortened'
    },
    {
      name: 'Long string without spaces',
      input: 'ThisIsALongStringWithoutSpacesThatNeedsToBeShortened',
      maxLength: 20,
      expected: 'ThisIsALo...hortened'
    },
    {
      name: 'String with word boundaries',
      input: 'A very long string with multiple words that should be cut at word boundaries',
      maxLength: 25,
      expected: 'A very long...boundaries'
    },
    {
      name: 'Very small maxLength',
      input: 'Short text',
      maxLength: 5,
      expected: 'S...t'
    },
    {
      name: 'Tiny maxLength',
      input: 'Very tiny',
      maxLength: 3,
      expected: 'Ver'
    },
    {
      name: 'Empty string',
      input: '',
      maxLength: 10,
      expected: ''
    },
    {
      name: 'Default maxLength',
      input: 'Using default max length which is 33',
      expected: 'Using default ...which is 33'
    }
  ];

  // Run tests using Jest
  testCases.forEach(testCase => {
    describe(`when processing ${testCase.name}`, () => {
      it(`should correctly shorten "${testCase.input}" with maxLength ${testCase.maxLength !== undefined ? testCase.maxLength : '(default)'}`, () => {
        const result = testCase.maxLength !== undefined 
          ? shortenString(testCase.input, testCase.maxLength) 
          : shortenString(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });
  });
});

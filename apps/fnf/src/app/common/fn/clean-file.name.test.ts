import {cleanFileName} from './clean-file.name.fn';

describe('cleanFileName', () => {
  // Test cases
  const testCases = [
    {
      input: 'Endstation.13.Sahara.1963.German.1080p.BluRay.x264-LIM.mkv',
      expected: 'Endstation.13.Sahara.1963'
    },
    {
      input: 'The.Matrix.1999.4K.HDR.DTS-HD.MA.5.1.x265-YIFY.mkv',
      expected: 'The.Matrix.1999'
    },
    {
      input: 'Inception 2010 BRRip XviD MP3-RARBG.avi',
      expected: 'Inception 2010'
    },
    {
      input: 'Breaking.Bad.S01E01.720p.HDTV.x264-LOL.mp4',
      expected: 'Breaking.Bad.S01E01'
    },
    {
      input: 'Documentary.2020.EXTENDED.1080p.WEB-DL.H264.AC3-EVO.mp4',
      expected: 'Documentary.2020'
    },
    {
      input: 'Movie Title With  Multiple   Spaces.mkv',
      expected: 'Movie Title With Multiple Spaces'
    },
    {
      input: '.Leading.Dot.Movie.2021.1080p.mkv',
      expected: 'Leading.Dot.Movie.2021'
    },
    {
      input: 'Trailing.Dot.Movie.2021.',
      expected: 'Trailing.Dot.Movie.2021'
    },
    {
      input: '',
      expected: ''
    }
  ];

  // Run tests using Jest
  testCases.forEach((test, index) => {
    it(`should correctly clean filename: ${test.input}`, () => {
      const result = cleanFileName(test.input);
      expect(result).toBe(test.expected);
    });
  });

  // Additional test for empty input
  it('should handle empty input', () => {
    expect(cleanFileName('')).toBe('');
  });
});

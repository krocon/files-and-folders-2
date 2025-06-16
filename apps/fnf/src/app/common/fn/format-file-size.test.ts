import {formatFileSize} from './format-file-size';

describe('formatFileSize', () => {
  // Edge cases
  it('should format 0 bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0.00 B');
  });

  it('should handle negative small values as 0', () => {
    expect(formatFileSize(-0.0001)).toBe('0.00 B');
  });

  it('should handle NaN input', () => {
    expect(formatFileSize(NaN)).toBe('0.00 B');
  });

  it('should handle undefined input', () => {
    expect(formatFileSize(undefined as any)).toBe('0.00 B');
  });

  it('should handle null input', () => {
    expect(formatFileSize(null as any)).toBe('0.00 B');
  });

  it('should handle empty string input', () => {
    expect(formatFileSize('' as any)).toBe('0.00 B');
  });

  it('should handle -1024 bytes correctly', () => {
    expect(formatFileSize(-1024)).toBe('0.00 B');
  });

  // Bytes range
  it('should format 1 byte correctly', () => {
    expect(formatFileSize(1)).toBe('1 bytes');
  });

  it('should format 512 bytes correctly', () => {
    expect(formatFileSize(512)).toBe('512 bytes');
  });

  it('should format 999 bytes correctly', () => {
    expect(formatFileSize(999)).toBe('999 bytes');
  });

  it('should format 1023 bytes correctly', () => {
    expect(formatFileSize(1023)).toBe('1023 bytes');
  });

  // KB range
  it('should format 1024 bytes (1KB) correctly', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
  });
  // KB range
  it('should format 1024 bytes (1KB) correctly', () => {
    expect(formatFileSize(1339)).toBe('1.31 KB');
  });

  it('should format 1536 bytes (1.5KB) correctly', () => {
    expect(formatFileSize(1536)).toBe('1.50 KB');
  });

  it('should format 10240 bytes (10KB) correctly', () => {
    expect(formatFileSize(10240)).toBe('10.00 KB');
  });

  // MB range
  it('should format 1048576 bytes (1MB) correctly', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB');
  });

  it('should format 2097152 bytes (2MB) correctly', () => {
    expect(formatFileSize(2097152)).toBe('2.00 MB');
  });

  it('should format 5242880 bytes (5MB) correctly', () => {
    expect(formatFileSize(5242880)).toBe('5.00 MB');
  });

  // GB range
  it('should format 1073741824 bytes (1GB) correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB');
  });

  it('should format 10737418240 bytes (10GB) correctly', () => {
    expect(formatFileSize(10737418240)).toBe('10.00 GB');
  });

  // TB range
  it('should format 1099511627776 bytes (1TB) correctly', () => {
    expect(formatFileSize(1099511627776)).toBe('1.00 TB');
  });

  // Custom decimal places
  it('should respect custom decimal places (1)', () => {
    expect(formatFileSize(1024, 1)).toBe('1.0 KB');
  });

  it('should respect custom decimal places (3)', () => {
    expect(formatFileSize(1048576, 3)).toBe('1.000 MB');
  });

  // Very large numbers
  it('should format 1PB correctly', () => {
    expect(formatFileSize(Math.pow(1024, 5))).toBe('1.00 PB');
  });

  it('should format 1EB correctly', () => {
    expect(formatFileSize(Math.pow(1024, 6))).toBe('1.00 EB');
  });

  it('should format 1YB correctly', () => {
    expect(formatFileSize(Math.pow(1024, 8))).toBe('1.00 YB');
  });
});
import {fetchT} from './fetchutil';

// Add declaration for global to fix TypeScript error
declare const global: {
  fetch: any;
  [key: string]: any;
};

describe('fetchT', () => {
  // Store the original fetch function
  const originalFetch = global.fetch;

  // Setup and teardown for mocking fetch
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Restore the original fetch function
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('should fetch data and parse JSON correctly', async () => {
    // Mock data
    const mockData = { id: 1, name: 'Test Item' };
    const mockResponse = {
      text: jest.fn().mockResolvedValue(JSON.stringify(mockData))
    };

    // Setup the mock fetch to return our mock response
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function
    const result = await fetchT<{ id: number, name: string }>('https://example.com/api');

    // Verify fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api', undefined);

    // Verify the response was processed correctly
    expect(mockResponse.text).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should pass request options to fetch', async () => {
    // Mock data
    const mockData = { success: true };
    const mockResponse = {
      text: jest.fn().mockResolvedValue(JSON.stringify(mockData))
    };

    // Setup the mock fetch to return our mock response
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Request options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: 'value' })
    };

    // Call the function with options
    await fetchT<{ success: boolean }>('https://example.com/api', options);

    // Verify fetch was called with the correct URL and options
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api', options);
  });

  it('should handle JSON parsing errors', async () => {
    // Mock an invalid JSON response
    const mockResponse = {
      text: jest.fn().mockResolvedValue('Invalid JSON')
    };

    // Setup the mock fetch to return our mock response
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function and expect it to throw
    await expect(fetchT<any>('https://example.com/api')).rejects.toThrow();
  });

  it('should handle network errors', async () => {
    // Setup the mock fetch to throw a network error
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    // Call the function and expect it to throw the same error
    await expect(fetchT<any>('https://example.com/api')).rejects.toThrow(networkError);
  });

  it('should handle response parsing errors', async () => {
    // Mock a response that throws when text() is called
    const textError = new Error('Text parsing error');
    const mockResponse = {
      text: jest.fn().mockRejectedValue(textError)
    };

    // Setup the mock fetch to return our mock response
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function and expect it to throw the same error
    await expect(fetchT<any>('https://example.com/api')).rejects.toThrow(textError);
  });
});

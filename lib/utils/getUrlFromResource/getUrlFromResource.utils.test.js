import getUrlFromResource from './getUrlFromResource.utils.js';

describe('getUrlFromResource', () => {
  it('should return a URL when passed a valid string', () => {
    const urlString = 'https://example.com/';
    const result = getUrlFromResource(urlString);
    expect(result).toBeInstanceOf(URL);
    expect(result.href).toBe(urlString);
  });

  it('should return a URL when passed a Request object', () => {
    const request = new Request('https://example.com');
    const result = getUrlFromResource(request);
    expect(result).toBeInstanceOf(URL);
    expect(result.href).toBe(request.url);
  });

  it('should return the same URL when passed a URL object', () => {
    const url = new URL('https://example.com');
    const result = getUrlFromResource(url);
    expect(result).toBe(url);
  });

  it('should throw an error when passed an invalid url', () => {
    const invalidInput = 'example.com'; // Invalid input (not a string, Request, or URL)
    expect(() => getUrlFromResource(invalidInput)).toThrow('Invalid URL');
  });

  it('should throw an error when passed an invalid input', () => {
    const invalidInput = 123; // Invalid input (not a string, Request, or URL)
    expect(() => getUrlFromResource(invalidInput)).toThrow(
      "Invalid resource input. 'resource' must be 'URL', 'Request' or 'string'.",
    );
  });
});

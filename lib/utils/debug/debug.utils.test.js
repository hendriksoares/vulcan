import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';

describe('debug utils', () => {
  let originalDebugValue;

  beforeAll(() => {
    originalDebugValue = process.env.DEBUG;
  });

  afterAll(() => {
    process.env.DEBUG = originalDebugValue;
    vi.restoreAllMocks();
  });

  test('Should log if debug flag is enabled', async () => {
    process.env.DEBUG = 'true';
    vi.resetModules();

    const { default: debug } = await import('./index.js');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    debug.error('test');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toBe('test');

    consoleSpy.mockRestore();
  });

  test('Should NOT log if debug flag is disabled', async () => {
    process.env.DEBUG = 'false';
    vi.resetModules();

    const { default: debug } = await import('./index.js');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    debug.error('test');

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

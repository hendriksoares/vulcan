import mockFs from 'mock-fs';
import { describe, test, expect } from 'vitest';
import getVulcanBuildId from './index.js';

describe('getVulcanBuildId utils', () => {
  test('Should fetch the unique build ID for the current project', async () => {
    mockFs({
      '.edge': { '.env': 'VERSION_ID=20230627142534' },
    });
    const expectedOutput = '20230627142534';

    const result = getVulcanBuildId();

    expect(result).toBe(expectedOutput);
    mockFs.restore();
  });
});

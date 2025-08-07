import getRandomInt from '@shared/lib/randomNumber';
import { describe, expect, it, vi } from 'vitest';

describe('getRandomInt', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint32Array) => {
        array[0] = 123456789;
      },
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should return a number within the range', () => {
    const min = 5;
    const max = 10;
    const result = getRandomInt(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should throw error when min > max', () => {
    expect(() => getRandomInt(10, 5)).toThrowError(
      'Invalid range: min must be less than max'
    );
  });

  it('should throw error when min === max', () => {
    expect(() => getRandomInt(5, 5)).toThrowError(
      'Invalid range: min must be less than max'
    );
  });
});

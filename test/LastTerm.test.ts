import { Term } from '@services/localStorage/LSService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Term class', () => {
  const testTerm = 'test search term';
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  describe('getTermFromLS', () => {
    it('should return undefined when LS is empty', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const result = Term.getTermFromLS();
      expect(result).toBeUndefined();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('lastSearchTerm');
    });

    it('should return value when it exists in LS', () => {
      localStorageMock.getItem.mockReturnValueOnce(testTerm);
      const result = Term.getTermFromLS();
      expect(result).toBe(testTerm);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('lastSearchTerm');
    });
  });

  describe('setTermToLS', () => {
    it('should set value to LS', () => {
      Term.setTermToLS(testTerm);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lastSearchTerm',
        testTerm
      );
    });

    it('should set empty string to LS', () => {
      Term.setTermToLS('');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lastSearchTerm',
        ''
      );
    });
  });
});

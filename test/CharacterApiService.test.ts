import CharacterApiService from '@services/api/apiService';
import getRandomInt from '@shared/lib/randomNumber';
import { Term } from '@services/localStorage/LastTerm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const UNAUTHORIZED = 401;

vi.stubEnv('VITE_API_KEY', 'oJHunt00vrX9Yile7Jny');
vi.stubEnv('VITE_API_KEY2', 'secondary_key');

vi.mock('@shared/lib/randomNumber', () => ({
  default: vi.fn().mockReturnValue(1),
}));

vi.mock('@services/localStorage/LastTerm', () => ({
  Term: {
    setTermToLS: vi.fn(),
    getTermFromLS: vi.fn(),
  },
}));

const mockApiResponse = {
  docs: [{ _id: '1', name: 'Character 1' }],
  total: 1,
  limit: 12,
  page: 1,
  pages: 2,
};

describe('CharacterApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    CharacterApiService['lastQuery'] = '';
    CharacterApiService['lastResponse'] = null;
    CharacterApiService['currentApiKey'] = import.meta.env.VITE_API_KEY;

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify(mockApiResponse), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('searchCharacters', () => {
    it('should make a successful API call with name parameter', async () => {
      const expectedApiKey = import.meta.env.VITE_API_KEY;
      const expectedAuthHeader = `Bearer ${expectedApiKey}`;
      const result = await CharacterApiService.searchCharacters('test');

      expect(fetch).toHaveBeenCalledTimes(1);

      const fetchMock = vi.mocked(fetch);
      const call = fetchMock.mock.calls[0];

      const url = call[0];
      const init = call[1] ?? {};

      expect(url).toBe(
        'https://the-one-api.dev/v2/character?name=%2Ftest%2Fi&limit=12&page=1'
      );

      const headers = new Headers(init.headers);

      expect(headers.get('Authorization')).toBe(expectedAuthHeader);
      expect(headers.get('Content-Type')).toBe('application/json');

      expect(Term.setTermToLS).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockApiResponse);
    });

    it('should make a successful API call with empty name parameter', async () => {
      const expectedApiKey = import.meta.env.VITE_API_KEY;
      const expectedAuthHeader = `Bearer ${expectedApiKey}`;

      const result = await CharacterApiService.searchCharacters();

      const fetchMock = vi.mocked(fetch);
      const call = fetchMock.mock.calls[0];

      const url = call[0];
      const init = call[1] ?? {};

      expect(url).toBe('https://the-one-api.dev/v2/character?limit=12&page=1');

      const headers = new Headers(init.headers);

      expect(headers.get('Authorization')).toBe(expectedAuthHeader);
      expect(headers.get('Content-Type')).toBe('application/json');

      expect(Term.setTermToLS).not.toHaveBeenCalled();
      expect(result).toEqual(mockApiResponse);
    });

    it('should use secondary API key if primary fails with 401', async () => {
      const secondaryApiKey = import.meta.env.VITE_API_KEY2;

      vi.mocked(fetch)
        .mockImplementationOnce(() => {
          const response = new Response(null, {
            status: UNAUTHORIZED,
            statusText: 'Unauthorized',
          });
          return Promise.resolve(response);
        })
        .mockImplementationOnce(() => {
          const response = new Response(JSON.stringify(mockApiResponse), {
            status: 200,
          });
          return Promise.resolve(response);
        });

      await CharacterApiService.searchCharacters('test');

      expect(fetch).toHaveBeenCalledTimes(2);

      expect(CharacterApiService['currentApiKey']).toBe(secondaryApiKey);
    });

    it('should load next page when more data is available', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockApiResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await CharacterApiService.searchCharacters('test');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockApiResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await CharacterApiService.loadMore();

      expect(fetch).toHaveBeenCalledTimes(2);

      const loadMoreCall = vi.mocked(fetch).mock.calls[1];
      const [url] = loadMoreCall;

      expect(url).toBe(
        'https://the-one-api.dev/v2/character?name=%2Ftest%2Fi&limit=12&page=2'
      );

      expect(result).toEqual(mockApiResponse);
    });
  });

  it('should load second page if it available', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await CharacterApiService.searchCharacters('test');

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await CharacterApiService.loadPage(2);

    expect(fetch).toHaveBeenCalledTimes(2);

    const loadMoreCall = vi.mocked(fetch).mock.calls[1];
    const [url] = loadMoreCall;

    expect(url).toBe(
      'https://the-one-api.dev/v2/character?name=%2Ftest%2Fi&limit=12&page=2'
    );

    expect(result).toEqual(mockApiResponse);
  });
});

describe('hasMore', () => {
  it('should return true when more pages are available', async () => {
    await CharacterApiService.searchCharacters('test');
    expect(CharacterApiService.hasMore()).toBe(true);
  });

  it('should return false when no more pages are available', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ...mockApiResponse,
          pages: 1,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await CharacterApiService.searchCharacters('test');

    expect(CharacterApiService.hasMore()).toBe(false);
  });
});

describe('getLoadedCount', () => {
  it('should return correct count after search', async () => {
    await CharacterApiService.searchCharacters('test');
    expect(CharacterApiService.getLoadedCount()).toBe(12);
  });
});

describe('triggerTestError', () => {
  it('should throw a random error', async () => {
    vi.mocked(getRandomInt).mockReturnValue(3);

    await expect(CharacterApiService.triggerTestError()).rejects.toThrow(
      '1001. Invalid Data - Incorrect data format'
    );
  });
});

import CharacterApiService from '@services/api/apiService';
import getRandomInt from '@shared/lib/randomNumber';
import { Term } from '@services/localStorage/LSService';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const UNAUTHORIZED = 401;

vi.stubEnv('VITE_API_KEY', 'ksmnN0SYU1vcR69udsuY');
vi.stubEnv('VITE_API_KEY2', 'oJHunt00vrX9Yile7Jny');

vi.mock('@shared/lib/randomNumber', () => ({
  default: vi.fn().mockReturnValue(1),
}));

vi.mock('@services/localStorage/LSService', () => ({
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
    CharacterApiService['currentApiKey'] =
      import.meta.env.VITE_API_KEY ?? 'ksmnN0SYU1vcR69udsuY';

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
    it('make a successful API call with name parameter', async () => {
      const expectedApiKey =
        import.meta.env.VITE_API_KEY ?? 'ksmnN0SYU1vcR69udsuY';
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

    it('make a successful API call with empty name parameter', async () => {
      const expectedApiKey =
        import.meta.env.VITE_API_KEY ?? 'ksmnN0SYU1vcR69udsuY';
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

    it('use secondary API key if primary fails with 401', async () => {
      const secondaryApiKey =
        import.meta.env.VITE_API_KEY2 ?? 'oJHunt00vrX9Yile7Jny';

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

    it('load next page when more data is available', async () => {
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

  it('load second page if it available', async () => {
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
  it('return true when more pages are available', async () => {
    await CharacterApiService.searchCharacters('test');
    expect(CharacterApiService.hasMore()).toBe(true);
  });

  it('return false when no more pages are available', async () => {
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
  it('return correct count after search', async () => {
    await CharacterApiService.searchCharacters('test');
    expect(CharacterApiService.getLoadedCount()).toBe(12);
  });
});

describe('triggerTestError', () => {
  it('throw a random error', async () => {
    vi.mocked(getRandomInt).mockReturnValue(3);

    await expect(CharacterApiService.triggerTestError()).rejects.toThrow(
      '1001. Invalid Data - Incorrect data format'
    );
  });
});
describe('getCharacterById', () => {
  const mockCharacter = {
    _id: '5cd99d4bde30eff6ebccfc07',
    name: 'Gandalf',
  };

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            docs: [mockCharacter],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    );
  });

  it('fetch character by id successfully', async () => {
    const characterId = '5cd99d4bde30eff6ebccfc07';
    const result = await CharacterApiService.getCharacterById(characterId);

    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchMock = vi.mocked(fetch);
    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe(`https://the-one-api.dev/v2/character/${characterId}`);
    expect(options?.method).toBeUndefined();

    const headers = new Headers(options?.headers);
    expect(headers.get('Authorization')).toBe(
      `Bearer ${import.meta.env.VITE_API_KEY ?? 'ksmnN0SYU1vcR69udsuY'}`
    );
    expect(headers.get('Content-Type')).toBe('application/json');

    expect(result).toEqual(mockCharacter);
  });
});

describe('getCharactersByIds', () => {
  const mockCharacters = [
    {
      _id: '1',
      name: 'Gandalf',
    },
    {
      _id: '2',
      name: 'Aragorn',
    },
  ];
  beforeEach(() => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = input.toString();
      const id = url.split('/').pop();

      const character = mockCharacters.find((c) => c._id === id);

      return Promise.resolve(
        new Response(
          JSON.stringify({
            docs: character ? [character] : [],
          }),
          {
            status: character ? 200 : 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    });
  });
  it('return characters with URL', async () => {
    const result = await CharacterApiService.getCharactersByIds(['1', '2']);

    expect(result).toEqual([
      { ...mockCharacters[0], url: expect.stringContaining('/1') },
      { ...mockCharacters[1], url: expect.stringContaining('/2') },
    ]);
  });

  it('fetch multiple characters by ids successfully', async () => {
    const ids = ['1', '2'];
    const result = await CharacterApiService.getCharactersByIds(ids);

    expect(fetch).toHaveBeenCalledTimes(2);

    const fetchMock = vi.mocked(fetch);

    const [firstUrl] = fetchMock.mock.calls[0];
    expect(firstUrl).toBe('https://the-one-api.dev/v2/character/1');

    const [secondUrl] = fetchMock.mock.calls[1];
    expect(secondUrl).toBe('https://the-one-api.dev/v2/character/2');

    expect(result).toEqual([
      {
        ...mockCharacters[0],
        url: 'https://the-one-api.dev/v2/character/1',
      },
      {
        ...mockCharacters[1],
        url: 'https://the-one-api.dev/v2/character/2',
      },
    ]);
  });

  it('return empty array when ids not provided', async () => {
    const result = await CharacterApiService.getCharactersByIds([]);
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

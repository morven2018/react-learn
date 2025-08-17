import { configureStore } from '@reduxjs/toolkit';
import type { ApiResponse, Person } from '@shared/types/response-types';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  characterApi,
  useGetCharacterByIdQuery,
  useSearchCharactersQuery,
  useGetCharactersByIdsQuery,
} from '@services/api/character-api';

const mockBaseQuery = vi.fn();
const mockErrorMessages = {
  404: 'Character not found!',
  400: 'Bad request!',
};
const mockHttpStatus = {
  NotFound: 404,
  BadRequest: 400,
};

vi.mock('./dynamic-base-query', () => ({
  staggeredBaseQuery: mockBaseQuery,
  ERROR_MESSAGES: mockErrorMessages,
  HttpStatus: mockHttpStatus,
}));

describe('characterApi', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [characterApi.reducerPath]: characterApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(characterApi.middleware),
    });

    vi.clearAllMocks();
    mockBaseQuery.mockReset();
  });

  it('fetch a character', async () => {
    const mockCharacter: Person = {
      _id: '5cd99d4bde30eff6ebccfea0',
      name: 'Gandalf',
      race: 'Maiar',
      birth: 'Before the the Shaping of Arda',
      gender: 'Male',
      death: 'January 253019 ,Battle of the Peak immortal',
      hair: 'Grey, later white',
      height: null,
      realm: null,
      spouse: null,
      wikiUrl: 'http://lotr.wikia.com//wiki/Gandalf',
    };

    mockBaseQuery.mockResolvedValue({
      data: { docs: [mockCharacter] },
      meta: {
        request: new Request('https://test'),
        response: new Response(),
      },
    });

    const { result } = renderHook(
      () => useGetCharacterByIdQuery('5cd99d4bde30eff6ebccfea0'),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCharacter);
  });

  describe('searchCharacters', () => {
    it('search characters', async () => {
      const mockResponse: ApiResponse = {
        docs: [
          {
            _id: '5cd99d4bde30eff6ebccfea0',
            name: 'Gandalf',
            race: 'Maiar',
            birth: 'Before the the Shaping of Arda',
            gender: 'Male',
            death: 'January 253019 ,Battle of the Peak immortal',
            hair: 'Grey, later white',
            height: null,
            realm: null,
            spouse: null,
            wikiUrl: 'http://lotr.wikia.com//wiki/Gandalf',
          },
        ],
        total: 1,
        limit: 12,
        page: 1,
        pages: 1,
      };

      mockBaseQuery.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(
        () => useSearchCharactersQuery({ name: 'Gandalf', page: 1 }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({
        data: mockResponse,
        state: 'success',
      });
    });

    it('handle search error', async () => {
      mockBaseQuery.mockRejectedValue({
        error: 'Bad request!',
        data: null,
        state: 'error',
      });

      const { result } = renderHook(
        () => useSearchCharactersQuery({ name: 'Invalid', page: 1 }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(false));
    });
  });

  describe('getCharactersByIds', () => {
    it('fetch multiple characters', async () => {
      const mockCharacters = [
        {
          _id: '5cd99d4bde30eff6ebccfea0',
          name: 'Gandalf',
          race: 'Maiar',
          birth: 'Before the the Shaping of Arda',
          gender: 'Male',
          death: 'January 253019 ,Battle of the Peak immortal',
          hair: 'Grey, later white',
          height: null,
          realm: null,
          spouse: null,
          wikiUrl: 'http://lotr.wikia.com//wiki/Gandalf',
          url: 'character/5cd99d4bde30eff6ebccfea0',
        },
      ];
      mockBaseQuery.mockResolvedValueOnce({ data: { docs: [] } });

      mockBaseQuery.mockImplementation((arg) => {
        if (arg.startsWith('character/')) {
          return {
            data: { docs: [mockCharacters[0]] },
            meta: {
              request: new Request('https://test'),
              response: new Response(),
            },
          };
        }
        return { data: { docs: [] } };
      });

      const { result } = renderHook(
        () => useGetCharactersByIdsQuery(['5cd99d4bde30eff6ebccfea0']),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCharacters);
    });

    it('handle empty ids array', async () => {
      const { result } = renderHook(() => useGetCharactersByIdsQuery([]), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });
});

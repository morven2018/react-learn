import { createApi } from '@reduxjs/toolkit/query/react';
import type { CharacterApiEndpoints } from './types';

import type {
  ApiResponse,
  Person,
  PersonWithUrl,
} from '@shared/types/response-types';

import {
  ERROR_MESSAGES,
  HttpStatus,
  staggeredBaseQuery,
} from './dynamic-base-query';

const BASE_LIMIT = '12';

type ApiError = {
  status: number;
  data: {
    message?: string;
  };
};

export const characterApi = createApi({
  reducerPath: 'characterApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['Characters'],
  endpoints: (builder): CharacterApiEndpoints => ({
    getCharacterById: builder.query<Person, string>({
      query: (id) => `character/${id}`,
      transformResponse: (response: { docs: Person[] }) => {
        if (!response?.docs?.[0])
          throw new Error(ERROR_MESSAGES[HttpStatus.NotFound]);
        return response.docs[0];
      },
      providesTags: (_result, _error, id) => [{ type: 'Characters', id }],
    }),

    searchCharacters: builder.query<
      {
        data: ApiResponse | null;
        state: 'loading' | 'success' | 'error';
        error?: string;
      },
      { name?: string; page?: number }
    >({
      query: ({ name = '', page = 1 }) => {
        const params = new URLSearchParams();
        if (name) params.append('name', `/${name}/i`);
        params.append('page', page.toString());
        params.append('limit', BASE_LIMIT);
        return `character?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse) => ({
        data: response,
        state: 'success' as const,
      }),
      transformErrorResponse: (response: ApiError) => ({
        data: null,
        state: 'error' as const,
        error: response.data?.message || ERROR_MESSAGES[HttpStatus.BadRequest],
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.name ?? '',
      merge(currentCache, newData, otherArgs) {
        if (newData.state === 'error') return newData;
        if (otherArgs.arg.page === 1) return newData;
        return currentCache;
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.name !== previousArg?.name
        );
      },
    }),

    getCharactersByIds: builder.query<PersonWithUrl[], string[]>({
      async queryFn(ids, _queryApi, _extraOptions, baseQuery) {
        if (!ids || ids.length === 0) {
          return { data: [] };
        }

        const getCachedCharacter = (id: string) => {
          const currentState = _queryApi.getState() as {
            [characterApi.reducerPath]: ReturnType<typeof characterApi.reducer>;
          };

          return characterApi.endpoints.getCharacterById.select(id)(
            currentState
          );
        };

        try {
          const characters = await Promise.all(
            ids.map(async (id) => {
              try {
                const cachedData = getCachedCharacter(id);

                if (cachedData.data) {
                  return {
                    ...cachedData.data,
                    url: `character/${id}`,
                  };
                }

                const result = await baseQuery(`character/${id}`);
                if (result.error) throw result.error;
                const response = result.data as { docs: Person[] };
                if (!response?.docs?.[0]) {
                  throw new Error(ERROR_MESSAGES[HttpStatus.NotFound]);
                }

                return {
                  ...response.docs[0],
                  url: `character/${id}`,
                };
              } catch {
                return null;
              }
            })
          );

          const filteredCharacters = characters.filter(
            (char): char is PersonWithUrl => char !== null
          );

          return { data: filteredCharacters };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Characters' as const,
                id: _id,
              })),
              { type: 'Characters', id: 'LIST' },
            ]
          : [{ type: 'Characters', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCharacterByIdQuery,
  useSearchCharactersQuery,
  useLazySearchCharactersQuery,
  useGetCharactersByIdsQuery,
  useLazyGetCharactersByIdsQuery,
} = characterApi;

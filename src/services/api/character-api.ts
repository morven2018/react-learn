import type { CharacterApiEndpoints } from './types';

import {
  createApi,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

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
      providesTags: (result) =>
        result?.data?.docs
          ? [
              ...result.data.docs.map(({ _id }) => ({
                type: 'Characters' as const,
                id: _id,
              })),
              { type: 'Characters' as const, id: 'LIST' },
            ]
          : [{ type: 'Characters' as const, id: 'LIST' }],
    }),

    getCharactersByIds: builder.query<PersonWithUrl[], string[]>({
      async queryFn(ids, _queryApi) {
        if (!ids || ids.length === 0) {
          return { data: [] };
        }

        try {
          const promises = ids.map((id) =>
            _queryApi.dispatch(
              characterApi.endpoints.getCharacterById.initiate(id)
            )
          );

          const results = await Promise.all(promises);
          const characters = results.map((result) => {
            if ('data' in result && result.data) {
              return {
                ...result.data,
                url: `character/${result.originalArgs}`,
              };
            }
            return null;
          });

          const filteredCharacters = characters.filter(
            (char): char is PersonWithUrl => char !== null
          );

          return { data: filteredCharacters };
        } catch (error) {
          return { error: error as FetchBaseQueryError };
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
  useLazyGetCharacterByIdQuery,
  useSearchCharactersQuery,
  useLazySearchCharactersQuery,
  useGetCharactersByIdsQuery,
  useLazyGetCharactersByIdsQuery,
} = characterApi;

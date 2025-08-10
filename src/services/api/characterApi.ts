import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Person } from '@shared/types/response-types';

import {
  ERROR_MESSAGES,
  HttpStatus,
  staggeredBaseQuery,
} from './dynamicBaseQuery';

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
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetCharacterByIdQuery,
  useSearchCharactersQuery,
  useLazySearchCharactersQuery,
} = characterApi;

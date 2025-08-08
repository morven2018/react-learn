import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Person } from '@shared/types/response-types';

import {
  ERROR_MESSAGES,
  HttpStatus,
  staggeredBaseQuery,
} from './dynamicBaseQuery';

const BASE_LIMIT = '12';
const CHARACTERS_TAG_TYPE = 'Characters' as const;

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
      ApiResponse,
      { name?: string; page?: number }
    >({
      query: ({ name = '', page = 1 }) => {
        const params = new URLSearchParams();
        if (name) params.append('name', `/${name}/i`);
        params.append('page', page.toString());
        params.append('limit', BASE_LIMIT);
        return `character?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: undefined,
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.name !== previousArg?.name
        );
      },
      providesTags: (result) =>
        result?.docs
          ? [
              ...result.docs.map(({ _id }) => ({
                type: CHARACTERS_TAG_TYPE,
                _id,
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
} = characterApi;

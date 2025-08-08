import { createApi } from '@reduxjs/toolkit/query/react';

import {
  ERROR_MESSAGES,
  HttpStatus,
  staggeredBaseQuery,
} from './dynamicBaseQuery';

import type { Person } from '@shared/types/response-types';

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
  }),
});

export const { useGetCharacterByIdQuery, useLazyGetCharacterByIdQuery } =
  characterApi;

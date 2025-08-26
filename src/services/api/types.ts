import type { BaseQueryFn, QueryDefinition } from '@reduxjs/toolkit/query';

import type { ApiResponse, Person } from '@shared/types/response-types';

export type CharacterApiEndpoints = {
  getCharacterById: QueryDefinition<
    string,
    BaseQueryFn,
    'Characters',
    Person,
    'characterApi'
  >;
  searchCharacters: QueryDefinition<
    { name?: string; page?: number },
    BaseQueryFn,
    'Characters',
    {
      data: ApiResponse | null;
      state: 'loading' | 'success' | 'error';
      error?: string;
    },
    'characterApi'
  >;
};

import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { API_BASE, dynamicBaseQuery } from '@services/api/dynamic-base-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  BaseQueryFn,
} from '@reduxjs/toolkit/query';

type ApiResponseData = {
  docs: unknown[];
  total: number;
  limit: number;
  page: number;
  pages: number;
};

type SuccessResponse = {
  data: ApiResponseData;
  meta: FetchBaseQueryMeta;
};

type ErrorResponse = {
  error: FetchBaseQueryError;
};

type QueryResponse = SuccessResponse | ErrorResponse;

const createResponseMeta = (): FetchBaseQueryMeta => ({
  request: new Request(API_BASE),
  response: new Response(),
});

const createSuccessResponse = (data: ApiResponseData): SuccessResponse => ({
  data,
  meta: createResponseMeta(),
});

const createErrorResponse = (
  status: number,
  message: string
): ErrorResponse => ({
  error: { status, data: message },
});

const createMockBaseQueryFn = (
  response: QueryResponse
): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> => {
  return async () => {
    if ('error' in response) {
      return { error: response.error };
    }
    return { data: response.data, meta: response.meta };
  };
};

class MockAbortSignal implements AbortSignal {
  aborted = false;
  reason: string | undefined;
  onabort: ((this: AbortSignal, ev: Event) => unknown) | null = null;

  throwIfAborted(): void {
    if (this.aborted) {
      throw new DOMException(this.reason || 'Aborted', 'AbortError');
    }
  }

  addEventListener(): void {}

  removeEventListener(): void {}

  dispatchEvent(event: Event): boolean {
    return event.defaultPrevented;
  }
}

vi.mock('@reduxjs/toolkit/query', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@reduxjs/toolkit/query')>();
  return {
    ...actual,
    fetchBaseQuery: vi.fn().mockImplementation(() => vi.fn()),
  };
});

describe('API Base Query', () => {
  const mockApi: BaseQueryApi = {
    dispatch: vi.fn(),
    getState: vi.fn(),
    extra: undefined,
    type: 'query',
    endpoint: 'test',
    abort: vi.fn(),
    signal: new MockAbortSignal(),
  };

  const mockExtraOptions: Record<string, never> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchBaseQuery).mockImplementation(() => vi.fn());
  });

  it('use primary API key on first attempt', async () => {
    const mockSuccessResponse = createSuccessResponse({
      docs: [],
      total: 0,
      limit: 10,
      page: 1,
      pages: 1,
    });

    vi.mocked(fetchBaseQuery).mockImplementationOnce(() =>
      createMockBaseQueryFn(mockSuccessResponse)
    );

    const result = await dynamicBaseQuery(
      { url: 'test' },
      mockApi,
      mockExtraOptions
    );

    expect(fetchBaseQuery).toHaveBeenCalled();
    expect(result).toEqual(mockSuccessResponse);
  });

  it('fall back to secondary API key on 401 error', async () => {
    const mockErrorResponse = createErrorResponse(401, 'Unauthorized');
    const mockSuccessResponse = createSuccessResponse({
      docs: [],
      total: 0,
      limit: 10,
      page: 1,
      pages: 1,
    });

    vi.mocked(fetchBaseQuery)
      .mockImplementationOnce(() => createMockBaseQueryFn(mockErrorResponse))
      .mockImplementationOnce(() => createMockBaseQueryFn(mockSuccessResponse));

    const result = await dynamicBaseQuery(
      { url: 'test' },
      mockApi,
      mockExtraOptions
    );

    expect(fetchBaseQuery).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockSuccessResponse);
  });
});

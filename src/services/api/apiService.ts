import getRandomInt from '@shared/lib/randomNumber';
import { Term } from '@services/localStorage/LastTerm';
import type { ApiResponse } from '@shared/types/responseTypes';

const API_BASE = import.meta.env.VITE_API_URL;
const API_KEY_PRIMARY = import.meta.env.VITE_API_KEY;
const API_KEY_SECONDARY = import.meta.env.VITE_API_KEY2;
const BASE_LIMIT = 20;
const ERROR_TYPES_COUNT = 5;

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const CUSTOM_ERROR_CODES = {
  NETWORK_ERROR: 1000,
  INVALID_DATA: 1001,
  API_ERROR: 1002,
  UNKNOWN_ERROR: 9999,
};

const ERROR_MESSAGES: { [key: number]: string } = {
  [HTTP_STATUS.BAD_REQUEST]:
    '400. Bad Request - The server cannot process the request',
  [HTTP_STATUS.UNAUTHORIZED]: '401. Unauthorized - Authentication required',
  [HTTP_STATUS.FORBIDDEN]: '403. Forbidden - Insufficient permissions',
  [HTTP_STATUS.NOT_FOUND]: '404. Not Found - Resource does not exist',
  [HTTP_STATUS.TOO_MANY_REQUESTS]:
    '429. Too Many Requests - Rate limit exceeded',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]:
    '500. Internal Server Error - Server encountered an error',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]:
    '503. Service Unavailable - Temporary maintenance',
  [CUSTOM_ERROR_CODES.NETWORK_ERROR]:
    '1000. Network Error - Connection problem or timeout',
  [CUSTOM_ERROR_CODES.INVALID_DATA]:
    '1001. Invalid Data - Incorrect data format',
  [CUSTOM_ERROR_CODES.API_ERROR]: '1002. API Error - External service failure',
  [CUSTOM_ERROR_CODES.UNKNOWN_ERROR]:
    '9999. Unknown Error - Unexpected situation occurred',
};

class CharacterApiService {
  private static lastQuery: string = '';
  private static lastResponse: ApiResponse | null = null;
  private static currentApiKey = API_KEY_PRIMARY;

  private static createError(code: number): Error {
    const message =
      ERROR_MESSAGES[code] || ERROR_MESSAGES[CUSTOM_ERROR_CODES.UNKNOWN_ERROR];
    const fullMessage = message;
    return new Error(fullMessage);
  }

  private static async authorizedFetch(
    url: string,
    retry = true
  ): Promise<Response> {
    try {
      const headers = new Headers({
        Authorization: `Bearer ${this.currentApiKey}`,
        'Content-Type': 'application/json',
      });

      const response = await fetch(url, { headers });

      if (
        response.status === HTTP_STATUS.UNAUTHORIZED &&
        retry &&
        API_KEY_SECONDARY
      ) {
        this.currentApiKey = API_KEY_SECONDARY;
        return this.authorizedFetch(url, false);
      }

      if (!response.ok) {
        throw this.createError(response.status);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw this.createError(CUSTOM_ERROR_CODES.NETWORK_ERROR);
    }
  }

  static async searchCharacters(
    name: string = '',
    page: number = 1
  ): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();

    if (name) {
      queryParams.append('name', `/${name}/i`);
      Term.setTermToLS(name);
      this.lastQuery = name;
    }

    queryParams.append('limit', BASE_LIMIT.toString());
    queryParams.append('page', page.toString());

    const url = `${API_BASE}character?${queryParams.toString()}`;
    const response = await this.authorizedFetch(url);
    this.lastResponse = await response.json();

    if (!this.lastResponse?.docs) {
      throw this.createError(CUSTOM_ERROR_CODES.INVALID_DATA);
    }

    return this.lastResponse;
  }

  static async loadMore(): Promise<ApiResponse> {
    if (!this.lastResponse) {
      throw this.createError(HTTP_STATUS.BAD_REQUEST);
    }

    const nextPage = this.lastResponse.page + 1;
    if (nextPage > this.lastResponse.pages) {
      throw this.createError(HTTP_STATUS.BAD_REQUEST);
    }

    return this.searchCharacters(this.lastQuery, nextPage);
  }

  static hasMore(): boolean {
    return this.lastResponse
      ? this.lastResponse.page < this.lastResponse.pages
      : false;
  }

  static getLoadedCount(): number {
    return this.lastResponse
      ? this.lastResponse.page * this.lastResponse.limit
      : 0;
  }

  static async triggerTestError(): Promise<never> {
    const errorType = getRandomInt(1, ERROR_TYPES_COUNT);

    const errors = [
      () => this.createError(CUSTOM_ERROR_CODES.NETWORK_ERROR),
      () => this.createError(HTTP_STATUS.INTERNAL_SERVER_ERROR),
      () => this.createError(CUSTOM_ERROR_CODES.INVALID_DATA),
      () => this.createError(HTTP_STATUS.UNAUTHORIZED),
      () => this.createError(HTTP_STATUS.NOT_FOUND),
    ];

    throw errors[errorType - 1]();
  }
}

export default CharacterApiService;

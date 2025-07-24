import getRandomInt from '@shared/lib/randomNumber';
import { Term } from '@services/localStorage/LastTerm';
import type { ApiResponse } from '@shared/types/responseTypes';

const API_BASE = 'https://the-one-api.dev/v2/';
const API_KEY_PRIMARY = import.meta.env.VITE_API_KEY;
const API_KEY_SECONDARY = import.meta.env.VITE_API_KEY2;
const BASE_LIMIT = 20;
const ERROR_TYPES_COUNT = 5;

enum HttpStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}
enum CustomErrorCode {
  NetworkError = 1000,
  InvalidData = 1001,
  ApiError = 1002,
  UnknownError = 9999,
}

const ERROR_MESSAGES: { [key: number]: string } = {
  [HttpStatus.BadRequest]:
    '400. Bad Request - The server cannot process the request',
  [HttpStatus.Unauthorized]: '401. Unauthorized - Authentication required',
  [HttpStatus.Forbidden]: '403. Forbidden - Insufficient permissions',
  [HttpStatus.NotFound]: '404. Not Found - Resource does not exist',
  [HttpStatus.TooManyRequests]: '429. Too Many Requests - Rate limit exceeded',
  [HttpStatus.InternalServerError]:
    '500. Internal Server Error - Server encountered an error',
  [HttpStatus.ServiceUnavailable]:
    '503. Service Unavailable - Temporary maintenance',
  [CustomErrorCode.NetworkError]:
    '1000. Network Error - Connection problem or timeout',
  [CustomErrorCode.InvalidData]: '1001. Invalid Data - Incorrect data format',
  [CustomErrorCode.ApiError]: '1002. API Error - External service failure',
  [CustomErrorCode.UnknownError]:
    '9999. Unknown Error - Unexpected situation occurred',
};

class CharacterApiService {
  private static lastQuery: string = '';
  private static lastResponse: ApiResponse | null = null;
  private static currentApiKey = API_KEY_PRIMARY;

  private static createError(code: number): Error {
    const message =
      ERROR_MESSAGES[code] || ERROR_MESSAGES[CustomErrorCode.UnknownError];
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
        response.status === HttpStatus.Unauthorized &&
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
      throw this.createError(CustomErrorCode.NetworkError);
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
      throw this.createError(CustomErrorCode.InvalidData);
    }

    return this.lastResponse;
  }

  static async loadMore(): Promise<ApiResponse> {
    if (!this.lastResponse) {
      throw this.createError(HttpStatus.BadRequest);
    }

    const nextPage = this.lastResponse.page + 1;
    if (nextPage > this.lastResponse.pages) {
      throw this.createError(HttpStatus.BadRequest);
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
      () => this.createError(CustomErrorCode.NetworkError),
      () => this.createError(HttpStatus.InternalServerError),
      () => this.createError(CustomErrorCode.InvalidData),
      () => this.createError(HttpStatus.Unauthorized),
      () => this.createError(HttpStatus.NotFound),
    ];

    throw errors[errorType - 1]();
  }
}

export default CharacterApiService;

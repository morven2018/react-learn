export const API_BASE = 'https://the-one-api.dev/v2/';

export enum HttpStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export enum CustomErrorCode {
  NetworkError = 1000,
  InvalidData = 1001,
  ApiError = 1002,
  UnknownError = 9999,
}

export const ERROR_MESSAGES: { [key: number]: string } = {
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

export function getApiKeys() {
  if (typeof window === 'undefined') {
    return {
      primary:
        process.env.LOTR_API_KEY ||
        process.env.NEXT_PUBLIC_KEY ||
        'ksmnN0SYU1vcR69udsuY',
      secondary:
        process.env.LOTR_API_KEY_BACKUP ||
        process.env.NEXT_PUBLIC_KEY2 ||
        'oJHunt00vrX9Yile7Jny',
    };
  }

  return {
    primary: process.env.NEXT_PUBLIC_KEY,
    secondary: process.env.NEXT_PUBLIC_KEY2,
  };
}

import {
  CustomErrorCode,
  ERROR_MESSAGES,
  HttpStatus,
} from './dynamicBaseQuery';

type ApiErrorObject = {
  status?: number;
  code?: number;
  message?: string;
  data?:
    | {
        message?: string;
      }
    | string;
};

type ErrorCode = HttpStatus | CustomErrorCode;

const isApiErrorObject = (error: unknown): error is ApiErrorObject => {
  return typeof error === 'object' && error !== null;
};

function isErrorCode(value: number): value is ErrorCode {
  return value in HttpStatus || value in CustomErrorCode;
}

const getMessageFromObject = (error: ApiErrorObject): string | undefined => {
  if (typeof error.data === 'object' && error.data !== null) {
    if ('message' in error.data && typeof error.data.message === 'string') {
      return error.data.message;
    }
  }

  if (typeof error.data === 'string') {
    return error.data;
  }

  if (typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
};

export const getErrorMessage = (error: unknown): string => {
  if (!error) return ERROR_MESSAGES[CustomErrorCode.UnknownError];
  if (typeof error === 'string') return error;
  if (error instanceof Error)
    return error.message || ERROR_MESSAGES[CustomErrorCode.UnknownError];

  if (isApiErrorObject(error)) {
    const status = error.status ?? error.code;

    if (
      status !== undefined &&
      isErrorCode(status) &&
      status in ERROR_MESSAGES
    ) {
      return ERROR_MESSAGES[status];
    }

    const messageFromObject = getMessageFromObject(error);
    if (messageFromObject) return messageFromObject;
  }

  return ERROR_MESSAGES[CustomErrorCode.UnknownError];
};

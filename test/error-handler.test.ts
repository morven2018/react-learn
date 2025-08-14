import { getErrorMessage } from '@services/api/error-handler';
import { describe, expect, it } from 'vitest';

import {
  CustomErrorCode,
  ERROR_MESSAGES,
  HttpStatus,
} from '@services/api/dynamic-base-query';

describe('getErrorMessage', () => {
  it('return unknown error message for null/undefined', () => {
    expect(getErrorMessage(null)).toBe(
      ERROR_MESSAGES[CustomErrorCode.UnknownError]
    );
    expect(getErrorMessage(undefined)).toBe(
      ERROR_MESSAGES[CustomErrorCode.UnknownError]
    );
  });

  it('return string error as-is', () => {
    const error = 'Simple error message';
    expect(getErrorMessage(error)).toBe(error);
  });

  it('return Error message', () => {
    const error = new Error('Standard error');
    expect(getErrorMessage(error)).toBe('Standard error');
  });

  it('return message from Error object with empty message', () => {
    const error = new Error('');
    expect(getErrorMessage(error)).toBe(
      ERROR_MESSAGES[CustomErrorCode.UnknownError]
    );
  });

  describe('ApiErrorObject handling', () => {
    it('use status code from error object', () => {
      const error = {
        status: HttpStatus.NotFound,
        data: { message: 'Custom not found' },
      };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES[HttpStatus.NotFound]);
    });

    it('use code if status not available', () => {
      const error = {
        code: CustomErrorCode.NetworkError,
        data: { message: 'Network issue' },
      };
      expect(getErrorMessage(error)).toBe(
        ERROR_MESSAGES[CustomErrorCode.NetworkError]
      );
    });

    it('use data.message when available', () => {
      const error = {
        data: { message: 'Custom data message' },
      };
      expect(getErrorMessage(error)).toBe('Custom data message');
    });

    it('use string data when available', () => {
      const error = {
        data: 'Raw error string',
      };
      expect(getErrorMessage(error)).toBe('Raw error string');
    });

    it('use top-level message when available', () => {
      const error = {
        message: 'Top level message',
      };
      expect(getErrorMessage(error)).toBe('Top level message');
    });

    it('fall back to unknown error for invalid status/code', () => {
      const error = {
        status: 999,
        code: 1234,
      };
      expect(getErrorMessage(error)).toBe(
        ERROR_MESSAGES[CustomErrorCode.UnknownError]
      );
    });
  });
});

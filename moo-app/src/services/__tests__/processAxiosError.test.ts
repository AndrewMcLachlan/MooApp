import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';
import { processAxiosError } from '../processAxiosError';

describe('processAxiosError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('with response', () => {
    it('returns error with detail from ProblemDetails', () => {
      const error = {
        response: {
          data: {
            detail: 'Detailed error message',
            title: 'Error Title',
          },
          statusText: 'Bad Request',
        },
      } as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Detailed error message');
    });

    it('returns error with title when detail is missing', () => {
      const error = {
        response: {
          data: {
            title: 'Error Title',
          },
          statusText: 'Bad Request',
        },
      } as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result.message).toBe('Error Title');
    });

    it('returns error with statusText when detail and title are missing', () => {
      const error = {
        response: {
          data: {},
          statusText: 'Not Found',
        },
      } as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result.message).toBe('Not Found');
    });

    it('logs the error to console', () => {
      const error = {
        response: {
          data: {
            detail: 'Test error',
          },
          statusText: 'Error',
        },
      } as AxiosError<any>;

      processAxiosError(error);

      expect(console.error).toHaveBeenCalledWith('API Error', error.response?.data);
    });
  });

  describe('with request but no response', () => {
    it('returns "No response received" error', () => {
      const error = {
        request: {},
        response: undefined,
      } as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result.message).toBe('No response received from server.');
    });
  });

  describe('with message only', () => {
    it('returns error with the message', () => {
      const error = {
        message: 'Network error occurred',
        request: undefined,
        response: undefined,
      } as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result.message).toBe('Network error occurred');
    });
  });

  describe('unknown error', () => {
    it('returns generic error for unknown cases', () => {
      const error = {} as AxiosError<any>;

      const result = processAxiosError(error);

      expect(result.message).toBe('An unknown error occurred.');
    });
  });
});

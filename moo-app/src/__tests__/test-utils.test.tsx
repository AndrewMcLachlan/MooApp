import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  createAxiosMock,
  createAxiosResponse,
  createAxiosError,
  createMsalContextMock,
  mockMsalAccount,
  mockAppConfig,
} from '../test-utils/mocks';

describe('moo-app Test Utilities', () => {
  describe('createAxiosMock', () => {
    it('creates mock with all HTTP methods', () => {
      const axios = createAxiosMock();

      expect(typeof axios.get).toBe('function');
      expect(typeof axios.post).toBe('function');
      expect(typeof axios.put).toBe('function');
      expect(typeof axios.patch).toBe('function');
      expect(typeof axios.delete).toBe('function');
    });

    it('creates mock with interceptors', () => {
      const axios = createAxiosMock();

      expect(axios.interceptors.request.use).toBeDefined();
      expect(axios.interceptors.response.use).toBeDefined();
    });

    it('methods are mockable', async () => {
      const axios = createAxiosMock();
      const mockData = { id: 1, name: 'Test' };

      (axios.get as any).mockResolvedValue(createAxiosResponse(mockData));

      const result = await axios.get('/api/test');
      expect(result.data).toEqual(mockData);
    });
  });

  describe('createAxiosResponse', () => {
    it('creates response with data', () => {
      const response = createAxiosResponse({ name: 'Test' });

      expect(response.data).toEqual({ name: 'Test' });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
    });

    it('creates response with custom headers', () => {
      const response = createAxiosResponse(
        { items: [] },
        { 'x-total-count': '100' }
      );

      expect(response.headers['x-total-count']).toBe('100');
    });

    it('creates response with custom status', () => {
      const response = createAxiosResponse(null, {}, 201);

      expect(response.status).toBe(201);
    });
  });

  describe('createAxiosError', () => {
    it('creates error with message and status', () => {
      const error = createAxiosError('Not Found', 404);

      expect(error.message).toBe('Not Found');
      expect(error.isAxiosError).toBe(true);
      expect(error.response.status).toBe(404);
    });

    it('creates error with response data', () => {
      const error = createAxiosError('Bad Request', 400, {
        errors: ['Invalid input'],
      });

      expect(error.response.data).toEqual({ errors: ['Invalid input'] });
    });
  });

  describe('createMsalContextMock', () => {
    it('creates mock with instance methods', () => {
      const context = createMsalContextMock();

      expect(typeof context.instance.acquireTokenSilent).toBe('function');
      expect(typeof context.instance.loginRedirect).toBe('function');
      expect(typeof context.instance.logoutRedirect).toBe('function');
    });

    it('returns mock account from getActiveAccount', () => {
      const context = createMsalContextMock();
      const account = context.instance.getActiveAccount();

      expect(account).toEqual(mockMsalAccount);
    });

    it('acquireTokenSilent returns access token', async () => {
      const context = createMsalContextMock();
      const result = await context.instance.acquireTokenSilent({} as any);

      expect(result.accessToken).toBe('mock-access-token');
    });
  });

  describe('mockMsalAccount', () => {
    it('has required account properties', () => {
      expect(mockMsalAccount.username).toBe('test@example.com');
      expect(mockMsalAccount.name).toBe('Test User');
      expect(mockMsalAccount.tenantId).toBeDefined();
    });
  });

  describe('mockAppConfig', () => {
    it('has app configuration', () => {
      expect(mockAppConfig.name).toBe('Test App');
      expect(mockAppConfig.version).toBe('1.0.0');
      expect(mockAppConfig.copyrightYear).toBe(2024);
    });
  });
});

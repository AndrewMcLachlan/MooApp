import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginRequest, apiRequest } from '../msal';

// We can't easily test getMsalInstance as it creates a real MSAL instance
// but we can test the exported configuration objects

describe('msal configuration', () => {
  describe('loginRequest', () => {
    it('is defined', () => {
      expect(loginRequest).toBeDefined();
    });

    it('has scopes array', () => {
      expect(loginRequest.scopes).toBeDefined();
      expect(Array.isArray(loginRequest.scopes)).toBe(true);
    });

    it('includes openid scope', () => {
      expect(loginRequest.scopes).toContain('openid');
    });

    it('includes profile scope', () => {
      expect(loginRequest.scopes).toContain('profile');
    });

    it('has exactly 2 scopes', () => {
      expect(loginRequest.scopes).toHaveLength(2);
    });
  });

  describe('apiRequest', () => {
    it('is defined', () => {
      expect(apiRequest).toBeDefined();
    });

    it('has scopes array', () => {
      expect(apiRequest.scopes).toBeDefined();
      expect(Array.isArray(apiRequest.scopes)).toBe(true);
    });

    it('has empty scopes by default', () => {
      expect(apiRequest.scopes).toHaveLength(0);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { usePageTitle } from '../pageTitle';

// Mock useApp
const mockUseApp = vi.fn();

vi.mock('../../providers/AppProvider', () => ({
  useApp: () => mockUseApp(),
}));

describe('usePageTitle', () => {
  beforeEach(() => {
    mockUseApp.mockReset();
    mockUseApp.mockReturnValue({ name: 'Test App' });
    document.title = '';
  });

  it('sets document title with page title and app name', () => {
    renderHook(() => usePageTitle('Dashboard'));

    expect(document.title).toBe('Dashboard : Test App');
  });

  it('uses app name from context', () => {
    mockUseApp.mockReturnValue({ name: 'My Application' });

    renderHook(() => usePageTitle('Home'));

    expect(document.title).toBe('Home : My Application');
  });

  it('handles undefined title', () => {
    renderHook(() => usePageTitle(undefined));

    expect(document.title).toBe('undefined : Test App');
  });

  it('handles empty string title', () => {
    renderHook(() => usePageTitle(''));

    // Empty string becomes just ": Test App" (no leading space)
    expect(document.title).toBe(': Test App');
  });

  it('updates title on rerender with new title', () => {
    const { rerender } = renderHook(
      ({ title }) => usePageTitle(title),
      { initialProps: { title: 'Page 1' } }
    );

    expect(document.title).toBe('Page 1 : Test App');

    rerender({ title: 'Page 2' });

    expect(document.title).toBe('Page 2 : Test App');
  });

  it('handles special characters in title', () => {
    renderHook(() => usePageTitle('User & Settings'));

    expect(document.title).toBe('User & Settings : Test App');
  });

  it('handles long titles', () => {
    const longTitle = 'This is a very long page title that might be truncated in some browsers';
    renderHook(() => usePageTitle(longTitle));

    expect(document.title).toBe(`${longTitle} : Test App`);
  });

  it('handles unicode in title', () => {
    renderHook(() => usePageTitle('Dashboard 🚀'));

    expect(document.title).toBe('Dashboard 🚀 : Test App');
  });
});

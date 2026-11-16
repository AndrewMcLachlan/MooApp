import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-toastify';
import { CopyText } from '../CopyText';

vi.mock('react-toastify', () => ({
  toast: { promise: vi.fn((promise: Promise<unknown>) => promise) },
}));

describe('CopyText', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    vi.mocked(toast.promise).mockClear();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('shows the text by default', () => {
    render(<CopyText text="#485" />);
    expect(screen.getByRole('button', { name: '#485' })).toHaveClass('copy-text');
  });

  it('shows children in place of the text', () => {
    render(<CopyText text="abc123">Commit</CopyText>);
    expect(screen.getByRole('button', { name: 'Commit' })).toHaveAttribute('title', 'Copy abc123');
  });

  it('copies the text and confirms with a toast', () => {
    render(<CopyText text="#485" />);
    fireEvent.click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledExactlyOnceWith('#485');
    expect(toast.promise).toHaveBeenCalledExactlyOnceWith(expect.any(Promise), { success: 'Copied #485', error: "Couldn't copy #485" });
  });

  it('reports a missing Clipboard API through the error toast', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    render(<CopyText text="#485" />);
    fireEvent.click(screen.getByRole('button'));

    const [promise] = vi.mocked(toast.promise).mock.calls[0];
    await expect(promise).rejects.toThrow();
  });

  it('applies a custom class', () => {
    render(<CopyText text="#485" className="pr-number" />);
    expect(screen.getByRole('button')).toHaveClass('copy-text', 'pr-number');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Upload } from '../Upload';

describe('Upload', () => {
  describe('rendering', () => {
    it('renders upload section', () => {
      const { container } = render(<Upload />);

      expect(container.querySelector('.upload')).toBeInTheDocument();
    });

    it('renders upload box', () => {
      const { container } = render(<Upload />);

      expect(container.querySelector('.upload-box')).toBeInTheDocument();
    });

    it('renders upload icon', () => {
      const { container } = render(<Upload />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'upload');
    });

    it('renders upload instructions', () => {
      render(<Upload />);

      expect(screen.getByText(/Drag a file here/)).toBeInTheDocument();
      expect(screen.getByText(/click to browse/)).toBeInTheDocument();
    });

    it('renders file input', () => {
      const { container } = render(<Upload />);

      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('renders empty file list initially', () => {
      const { container } = render(<Upload />);

      expect(container.querySelector('ul')?.children.length).toBe(0);
    });
  });

  describe('accept prop', () => {
    it('passes accept to file input', () => {
      const { container } = render(<Upload accept=".pdf,.doc" />);

      expect(container.querySelector('input[type="file"]')).toHaveAttribute('accept', '.pdf,.doc');
    });
  });

  describe('allowMultiple prop', () => {
    it('sets multiple attribute when allowMultiple is true', () => {
      const { container } = render(<Upload allowMultiple />);

      expect(container.querySelector('input[type="file"]')).toHaveAttribute('multiple');
    });

    it('does not set multiple attribute by default', () => {
      const { container } = render(<Upload />);

      expect(container.querySelector('input[type="file"]')).not.toHaveAttribute('multiple');
    });
  });

  describe('file selection', () => {
    it('displays selected file name', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]')!;

      const file = new File(['content'], 'test-file.pdf', { type: 'application/pdf' });
      Object.defineProperty(input, 'files', { value: [file] });

      fireEvent.change(input);

      expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    });

    it('calls onFilesAdded callback', () => {
      const onFilesAdded = vi.fn();
      const { container } = render(<Upload onFilesAdded={onFilesAdded} />);
      const input = container.querySelector('input[type="file"]')!;

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(input, 'files', { value: [file] });

      fireEvent.change(input);

      expect(onFilesAdded).toHaveBeenCalledWith({
        currentFiles: [],
        newFiles: [file],
      });
    });

    it('replaces file when allowMultiple is false', () => {
      const { container, rerender } = render(<Upload />);
      const input = container.querySelector('input[type="file"]')!;

      const file1 = new File(['1'], 'file1.pdf', { type: 'application/pdf' });
      Object.defineProperty(input, 'files', { value: [file1], configurable: true });
      fireEvent.change(input);

      expect(screen.getByText('file1.pdf')).toBeInTheDocument();

      // Re-render to get a fresh input element
      rerender(<Upload />);
      const input2 = container.querySelector('input[type="file"]')!;
      const file2 = new File(['2'], 'file2.pdf', { type: 'application/pdf' });
      Object.defineProperty(input2, 'files', { value: [file2], configurable: true });
      fireEvent.change(input2);

      expect(screen.getByText('file2.pdf')).toBeInTheDocument();
    });

    it('accumulates files when allowMultiple is true', () => {
      const onFilesAdded = vi.fn();
      const { container } = render(<Upload allowMultiple onFilesAdded={onFilesAdded} />);
      const input = container.querySelector('input[type="file"]')!;

      const file1 = new File(['1'], 'file1.pdf', { type: 'application/pdf' });
      Object.defineProperty(input, 'files', { value: [file1], configurable: true });
      fireEvent.change(input);

      expect(screen.getByText('file1.pdf')).toBeInTheDocument();
      expect(onFilesAdded).toHaveBeenCalledWith({
        currentFiles: [],
        newFiles: [file1],
      });
    });
  });

  describe('drag and drop', () => {
    it('handles dragEnter event', () => {
      const { container } = render(<Upload />);
      const dropZone = container.querySelector('.upload-box')!;

      const dataTransfer = { items: [{ kind: 'file' }] };
      fireEvent.dragEnter(dropZone, { dataTransfer });

      // Should not throw
    });

    it('handles dragLeave event', () => {
      const { container } = render(<Upload />);
      const dropZone = container.querySelector('.upload-box')!;

      fireEvent.dragLeave(dropZone);

      // Should not throw
    });

    it('handles dragOver event', () => {
      const { container } = render(<Upload />);
      const dropZone = container.querySelector('.upload-box')!;

      fireEvent.dragOver(dropZone);

      // Should not throw
    });

    it('handles drop event with files', () => {
      const { container } = render(<Upload />);
      const dropZone = container.querySelector('.upload-box')!;

      const file = new File(['content'], 'dropped-file.pdf', { type: 'application/pdf' });
      const dataTransfer = {
        files: [file],
        clearData: vi.fn(),
      };

      fireEvent.drop(dropZone, { dataTransfer });

      expect(screen.getByText('dropped-file.pdf')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Upload.displayName).toBe('Upload');
    });
  });
});

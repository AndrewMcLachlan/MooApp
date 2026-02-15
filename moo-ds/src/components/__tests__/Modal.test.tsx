import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  describe('visibility', () => {
    it('renders content', () => {
      render(<Modal show onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies show class when show is true', () => {
      const { baseElement } = render(<Modal show onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal.show')).toBeInTheDocument();
    });

    it('does not apply show class when show is false', () => {
      const { baseElement } = render(<Modal show={false} onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal.show')).not.toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('renders with modal class in portal', () => {
      const { baseElement } = render(<Modal show onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal')).toBeInTheDocument();
    });

    it('renders modal-dialog and modal-content', () => {
      const { baseElement } = render(<Modal show onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal-dialog')).toBeInTheDocument();
      expect(baseElement.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('renders backdrop when show is true', () => {
      const { baseElement } = render(<Modal show onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('does not render backdrop when show is false', () => {
      const { baseElement } = render(<Modal show={false} onHide={vi.fn()}><Modal.Body>Content</Modal.Body></Modal>);
      expect(baseElement.querySelector('.modal-backdrop')).not.toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it.each(['sm', 'lg', 'xl'] as const)('sets --modal-width CSS variable for %s', (size) => {
      const { baseElement } = render(<Modal show onHide={vi.fn()} size={size}><Modal.Body>Content</Modal.Body></Modal>);
      const modal = baseElement.querySelector('.modal') as HTMLElement;
      expect(modal.style.getPropertyValue('--modal-width')).toBeTruthy();
    });
  });

  describe('close', () => {
    it('calls onHide when backdrop clicked', () => {
      const onHide = vi.fn();
      const { baseElement } = render(<Modal show onHide={onHide}><Modal.Body>Content</Modal.Body></Modal>);
      fireEvent.click(baseElement.querySelector('.modal-backdrop')!);
      expect(onHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal.Header', () => {
    it('renders with modal-header class', () => {
      const { baseElement } = render(
        <Modal show onHide={vi.fn()}>
          <Modal.Header>Header</Modal.Header>
        </Modal>
      );
      expect(baseElement.querySelector('.modal-header')).toBeInTheDocument();
    });

    it('renders close button when closeButton prop', () => {
      render(
        <Modal show onHide={vi.fn()}>
          <Modal.Header closeButton>Header</Modal.Header>
        </Modal>
      );
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('calls onHide from close button', () => {
      const onHide = vi.fn();
      render(
        <Modal show onHide={onHide}>
          <Modal.Header closeButton>Header</Modal.Header>
        </Modal>
      );
      fireEvent.click(screen.getByLabelText('Close'));
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('has displayName', () => {
      expect(Modal.Header.displayName).toBe('Modal.Header');
    });
  });

  describe('Modal.Title', () => {
    it('renders with modal-title class', () => {
      render(
        <Modal show onHide={vi.fn()}>
          <Modal.Header><Modal.Title>Title</Modal.Title></Modal.Header>
        </Modal>
      );
      expect(screen.getByText('Title')).toHaveClass('modal-title');
    });

    it('has displayName', () => {
      expect(Modal.Title.displayName).toBe('Modal.Title');
    });
  });

  describe('Modal.Body', () => {
    it('renders with modal-body class', () => {
      const { baseElement } = render(
        <Modal show onHide={vi.fn()}>
          <Modal.Body>Body content</Modal.Body>
        </Modal>
      );
      expect(baseElement.querySelector('.modal-body')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Modal.Body.displayName).toBe('Modal.Body');
    });
  });

  describe('Modal.Footer', () => {
    it('renders with modal-footer class', () => {
      const { baseElement } = render(
        <Modal show onHide={vi.fn()}>
          <Modal.Footer>Footer</Modal.Footer>
        </Modal>
      );
      expect(baseElement.querySelector('.modal-footer')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Modal.Footer.displayName).toBe('Modal.Footer');
    });
  });

  it('has displayName', () => {
    expect(Modal.displayName).toBe('Modal');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../Drawer';

describe('Drawer', () => {
  describe('visibility', () => {
    it('applies show class when show is true', () => {
      const { container } = render(<Drawer show onHide={vi.fn()}><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(container.querySelector('.offcanvas.show')).toBeInTheDocument();
    });

    it('does not apply show class when show is false', () => {
      const { container } = render(<Drawer show={false} onHide={vi.fn()}><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(container.querySelector('.offcanvas.show')).not.toBeInTheDocument();
    });

    it('renders backdrop when show is true', () => {
      const { baseElement } = render(<Drawer show onHide={vi.fn()}><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(baseElement.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
    });

    it('does not render backdrop when show is false', () => {
      const { baseElement } = render(<Drawer show={false} onHide={vi.fn()}><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(baseElement.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
    });
  });

  describe('placement', () => {
    it('defaults to start placement', () => {
      const { container } = render(<Drawer show onHide={vi.fn()}><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(container.querySelector('.offcanvas-start')).toBeInTheDocument();
    });

    it('applies end placement', () => {
      const { container } = render(<Drawer show onHide={vi.fn()} placement="end"><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(container.querySelector('.offcanvas-end')).toBeInTheDocument();
    });
  });

  describe('close', () => {
    it('calls onHide when backdrop clicked', () => {
      const onHide = vi.fn();
      const { baseElement } = render(<Drawer show onHide={onHide}><Drawer.Body>Content</Drawer.Body></Drawer>);
      fireEvent.click(baseElement.querySelector('.offcanvas-backdrop')!);
      expect(onHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('Drawer.Header', () => {
    it('renders with offcanvas-header class', () => {
      const { container } = render(
        <Drawer show onHide={vi.fn()}>
          <Drawer.Header>Header</Drawer.Header>
        </Drawer>
      );
      expect(container.querySelector('.offcanvas-header')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(
        <Drawer show onHide={vi.fn()}>
          <Drawer.Header closeButton>Header</Drawer.Header>
        </Drawer>
      );
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Drawer.Header.displayName).toBe('Drawer.Header');
    });
  });

  describe('Drawer.Body', () => {
    it('renders with offcanvas-body class', () => {
      const { container } = render(
        <Drawer show onHide={vi.fn()}>
          <Drawer.Body>Body</Drawer.Body>
        </Drawer>
      );
      expect(container.querySelector('.offcanvas-body')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Drawer.Body.displayName).toBe('Drawer.Body');
    });
  });

  it('has displayName', () => {
    expect(Drawer.displayName).toBe('Drawer');
  });
});

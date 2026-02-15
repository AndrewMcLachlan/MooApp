import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverlayTrigger } from '../OverlayTrigger';

describe('OverlayTrigger', () => {
  const overlay = <div>Overlay content</div>;

  describe('click trigger', () => {
    it('shows overlay on click', () => {
      render(
        <OverlayTrigger trigger="click" overlay={overlay}>
          <button>Toggle</button>
        </OverlayTrigger>
      );

      expect(screen.queryByText('Overlay content')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByText('Overlay content')).toBeInTheDocument();
    });

    it('hides overlay on second click', () => {
      render(
        <OverlayTrigger trigger="click" overlay={overlay}>
          <button>Toggle</button>
        </OverlayTrigger>
      );

      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByText('Overlay content')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.queryByText('Overlay content')).not.toBeInTheDocument();
    });
  });

  describe('hover trigger', () => {
    it('shows overlay on mouse enter', () => {
      render(
        <OverlayTrigger trigger="hover" overlay={overlay}>
          <button>Hover me</button>
        </OverlayTrigger>
      );

      fireEvent.mouseEnter(screen.getByText('Hover me'));
      expect(screen.getByText('Overlay content')).toBeInTheDocument();
    });

    it('hides overlay on mouse leave', () => {
      render(
        <OverlayTrigger trigger="hover" overlay={overlay}>
          <button>Hover me</button>
        </OverlayTrigger>
      );

      fireEvent.mouseEnter(screen.getByText('Hover me'));
      fireEvent.mouseLeave(screen.getByText('Hover me'));
      expect(screen.queryByText('Overlay content')).not.toBeInTheDocument();
    });
  });

  describe('focus trigger', () => {
    it('shows overlay on focus', () => {
      render(
        <OverlayTrigger trigger="focus" overlay={overlay}>
          <button>Focus me</button>
        </OverlayTrigger>
      );

      fireEvent.focus(screen.getByText('Focus me'));
      expect(screen.getByText('Overlay content')).toBeInTheDocument();
    });

    it('hides overlay on blur', () => {
      render(
        <OverlayTrigger trigger="focus" overlay={overlay}>
          <button>Focus me</button>
        </OverlayTrigger>
      );

      fireEvent.focus(screen.getByText('Focus me'));
      fireEvent.blur(screen.getByText('Focus me'));
      expect(screen.queryByText('Overlay content')).not.toBeInTheDocument();
    });
  });

  it('defaults to click trigger', () => {
    render(
      <OverlayTrigger overlay={overlay}>
        <button>Toggle</button>
      </OverlayTrigger>
    );

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByText('Overlay content')).toBeInTheDocument();
  });

  it('has displayName', () => {
    expect(OverlayTrigger.displayName).toBe('OverlayTrigger');
  });
});

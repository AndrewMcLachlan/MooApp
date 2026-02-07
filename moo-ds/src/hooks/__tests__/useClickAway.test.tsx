import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useClickAway } from '../clickAway';

const TestComponent = ({
  setShow,
  onClickAway,
}: {
  setShow: (value: boolean) => void;
  onClickAway?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(setShow, ref, onClickAway);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside Element
      </div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

describe('useClickAway', () => {
  describe('mousedown events', () => {
    it('calls setShow(false) when clicking outside the ref element', () => {
      const setShow = vi.fn();
      render(<TestComponent setShow={setShow} />);

      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(setShow).toHaveBeenCalledWith(false);
    });

    it('does not call setShow when clicking inside the ref element', () => {
      const setShow = vi.fn();
      render(<TestComponent setShow={setShow} />);

      fireEvent.mouseDown(screen.getByTestId('inside'));

      expect(setShow).not.toHaveBeenCalled();
    });

    it('calls onClickAway callback when clicking outside', () => {
      const setShow = vi.fn();
      const onClickAway = vi.fn();
      render(<TestComponent setShow={setShow} onClickAway={onClickAway} />);

      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(onClickAway).toHaveBeenCalled();
    });

    it('does not call onClickAway when clicking inside', () => {
      const setShow = vi.fn();
      const onClickAway = vi.fn();
      render(<TestComponent setShow={setShow} onClickAway={onClickAway} />);

      fireEvent.mouseDown(screen.getByTestId('inside'));

      expect(onClickAway).not.toHaveBeenCalled();
    });
  });

  describe('touchstart events', () => {
    it('calls setShow(false) when touching outside the ref element', () => {
      const setShow = vi.fn();
      render(<TestComponent setShow={setShow} />);

      fireEvent.touchStart(screen.getByTestId('outside'));

      expect(setShow).toHaveBeenCalledWith(false);
    });

    it('does not call setShow when touching inside the ref element', () => {
      const setShow = vi.fn();
      render(<TestComponent setShow={setShow} />);

      fireEvent.touchStart(screen.getByTestId('inside'));

      expect(setShow).not.toHaveBeenCalled();
    });

    it('calls onClickAway callback when touching outside', () => {
      const setShow = vi.fn();
      const onClickAway = vi.fn();
      render(<TestComponent setShow={setShow} onClickAway={onClickAway} />);

      fireEvent.touchStart(screen.getByTestId('outside'));

      expect(onClickAway).toHaveBeenCalled();
    });
  });

  describe('event cleanup', () => {
    it('removes event listeners on unmount', () => {
      const setShow = vi.fn();
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<TestComponent setShow={setShow} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('nested elements', () => {
    it('does not trigger when clicking on child of ref element', () => {
      const setShow = vi.fn();

      const NestedComponent = () => {
        const ref = useRef<HTMLDivElement>(null);
        useClickAway(setShow, ref);

        return (
          <div>
            <div ref={ref} data-testid="parent">
              <button data-testid="child">Child Button</button>
            </div>
            <div data-testid="outside">Outside</div>
          </div>
        );
      };

      render(<NestedComponent />);

      fireEvent.mouseDown(screen.getByTestId('child'));
      expect(setShow).not.toHaveBeenCalled();

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(setShow).toHaveBeenCalledWith(false);
    });
  });

  describe('document clicks', () => {
    it('triggers on document body click', () => {
      const setShow = vi.fn();
      render(<TestComponent setShow={setShow} />);

      fireEvent.mouseDown(document.body);

      expect(setShow).toHaveBeenCalledWith(false);
    });
  });
});

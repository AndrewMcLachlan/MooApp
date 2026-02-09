import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRef, createRef, forwardRef } from 'react';
import { useInnerRef } from '../innerRef';

describe('useInnerRef', () => {
  describe('with callback ref', () => {
    it('calls callback ref with element', () => {
      const callbackRef = vi.fn();

      const TestComponent = () => {
        const innerRef = useInnerRef<HTMLDivElement>(callbackRef);
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      render(<TestComponent />);

      expect(callbackRef).toHaveBeenCalledWith(screen.getByTestId('element'));
    });

    it('is called once with element on mount', () => {
      const callbackRef = vi.fn();

      const TestComponent = () => {
        const innerRef = useInnerRef<HTMLDivElement>(callbackRef);
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      render(<TestComponent />);

      // Called once with the element
      expect(callbackRef).toHaveBeenCalledTimes(1);
      expect(callbackRef).toHaveBeenCalledWith(screen.getByTestId('element'));
    });
  });

  describe('with ref object', () => {
    it('sets ref.current to element', () => {
      const refObject = createRef<HTMLDivElement>();

      const TestComponent = () => {
        const innerRef = useInnerRef<HTMLDivElement>(refObject);
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      render(<TestComponent />);

      expect(refObject.current).toBe(screen.getByTestId('element'));
    });
  });

  describe('with null ref', () => {
    it('handles null ref without error', () => {
      const TestComponent = () => {
        const innerRef = useInnerRef<HTMLDivElement>(null);
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      expect(() => render(<TestComponent />)).not.toThrow();
      expect(screen.getByTestId('element')).toBeInTheDocument();
    });
  });

  describe('forwardRef pattern', () => {
    it('works with forwardRef components', () => {
      const ForwardedComponent = forwardRef<HTMLButtonElement>((props, ref) => {
        const innerRef = useInnerRef<HTMLButtonElement>(ref);
        return <button ref={innerRef} data-testid="button">Click me</button>;
      });

      const refObject = createRef<HTMLButtonElement>();

      render(<ForwardedComponent ref={refObject} />);

      expect(refObject.current).toBe(screen.getByTestId('button'));
    });

    it('allows internal use of ref alongside forwarding', () => {
      const ForwardedComponent = forwardRef<HTMLInputElement>((props, ref) => {
        const innerRef = useInnerRef<HTMLInputElement>(ref);

        const handleClick = () => {
          innerRef.current?.focus();
        };

        return (
          <div>
            <input ref={innerRef} data-testid="input" />
            <button onClick={handleClick} data-testid="focus-button">Focus</button>
          </div>
        );
      });

      const externalRef = createRef<HTMLInputElement>();
      render(<ForwardedComponent ref={externalRef} />);

      // Both internal and external access work
      expect(externalRef.current).toBe(screen.getByTestId('input'));
    });
  });

  describe('ref updates', () => {
    it('handles ref changes', () => {
      const ref1 = vi.fn();
      const ref2 = vi.fn();

      const TestComponent = ({ callbackRef }: { callbackRef: (el: HTMLDivElement | null) => void }) => {
        const innerRef = useInnerRef<HTMLDivElement>(callbackRef);
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      const { rerender } = render(<TestComponent callbackRef={ref1} />);

      expect(ref1).toHaveBeenCalled();

      rerender(<TestComponent callbackRef={ref2} />);

      expect(ref2).toHaveBeenCalled();
    });
  });

  describe('return value', () => {
    it('returns a mutable ref object', () => {
      let capturedRef: React.RefObject<HTMLDivElement> | null = null;

      const TestComponent = () => {
        const innerRef = useInnerRef<HTMLDivElement>(null);
        capturedRef = innerRef;
        return <div ref={innerRef} data-testid="element">Test</div>;
      };

      render(<TestComponent />);

      expect(capturedRef).not.toBeNull();
      expect(capturedRef!.current).toBe(screen.getByTestId('element'));
    });
  });
});

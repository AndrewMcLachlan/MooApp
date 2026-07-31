import { describe, it, expect, afterEach } from 'vitest';
import { supportsPopover, topLayerProps } from '../topLayer';

// jsdom implements no popover API, so the un-patched case is the real default
// here -- which is exactly the environment the feature detection exists for.
describe('topLayer', () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover');

    afterEach(() => {
        if (original) {
            Object.defineProperty(HTMLElement.prototype, 'showPopover', original);
        } else {
            delete (HTMLElement.prototype as any).showPopover;
        }
    });

    const withShowPopover = (value: unknown) =>
        Object.defineProperty(HTMLElement.prototype, 'showPopover', {
            value,
            configurable: true,
            writable: true,
        });

    describe('supportsPopover', () => {
        it('is false when the API is absent', () => {
            delete (HTMLElement.prototype as any).showPopover;
            expect(supportsPopover()).toBe(false);
        });

        it('is true when showPopover is a function', () => {
            withShowPopover(() => {});
            expect(supportsPopover()).toBe(true);
        });

        it('is false when showPopover exists but is not callable', () => {
            withShowPopover('nonsense');
            expect(supportsPopover()).toBe(false);
        });
    });

    describe('topLayerProps', () => {
        it('omits the attribute where the API is absent, so the element is not hidden', () => {
            delete (HTMLElement.prototype as any).showPopover;
            expect(topLayerProps()).toEqual({});
        });

        it('applies popover="manual" where the API is present', () => {
            withShowPopover(() => {});
            expect(topLayerProps()).toEqual({ popover: 'manual' });
        });
    });
});

import { describe, it, expect, afterEach } from 'vitest';
import { hideFromTopLayer, showInTopLayer, supportsPopover, topLayerProps } from "../topLayer";

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

describe('showInTopLayer', () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover');

    afterEach(() => {
        if (original) Object.defineProperty(HTMLElement.prototype, 'showPopover', original);
        else delete (HTMLElement.prototype as any).showPopover;
    });

    const withShowPopover = (value: unknown) =>
        Object.defineProperty(HTMLElement.prototype, 'showPopover', { value, configurable: true, writable: true });

    it('does nothing where the API is absent', () => {
        delete (HTMLElement.prototype as any).showPopover;
        expect(() => showInTopLayer(document.createElement('div'))).not.toThrow();
    });

    // ?.() would have called this and thrown; the typeof guard is what stops it.
    it('does not call a showPopover that is not a function', () => {
        withShowPopover('nonsense');
        expect(() => showInTopLayer(document.createElement('div'))).not.toThrow();
    });

    it('tolerates a null element', () => {
        withShowPopover(() => {});
        expect(() => showInTopLayer(null)).not.toThrow();
        expect(() => showInTopLayer(undefined)).not.toThrow();
    });

    it('calls showPopover where it is callable', () => {
        let called = 0;
        withShowPopover(function () { called += 1; });
        showInTopLayer(document.createElement('div'));
        expect(called).toBe(1);
    });
});

describe('hideFromTopLayer', () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover');
    const originalHide = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidePopover');

    afterEach(() => {
        if (originalShow) Object.defineProperty(HTMLElement.prototype, 'showPopover', originalShow);
        else delete (HTMLElement.prototype as any).showPopover;
        if (originalHide) Object.defineProperty(HTMLElement.prototype, 'hidePopover', originalHide);
        else delete (HTMLElement.prototype as any).hidePopover;
    });

    const withHidePopover = (value: unknown) =>
        Object.defineProperty(HTMLElement.prototype, 'hidePopover', { value, configurable: true, writable: true });

    // jsdom has no :popover-open, so drive matches() directly to isolate the guards.
    const elementThatIsOpen = (open: boolean) => {
        const el = document.createElement('div');
        el.matches = ((sel: string) => sel === ':popover-open' ? open : false) as typeof el.matches;
        return el;
    };

    it('does nothing where the API is absent', () => {
        delete (HTMLElement.prototype as any).hidePopover;
        expect(() => hideFromTopLayer(elementThatIsOpen(true))).not.toThrow();
    });

    it('does not call a hidePopover that is not a function', () => {
        withHidePopover('nonsense');
        expect(() => hideFromTopLayer(elementThatIsOpen(true))).not.toThrow();
    });

    // hidePopover() throws if the popover is not showing, which is what happens
    // when a component unmounts while already closed.
    it('does not call hidePopover on an element that is not open', () => {
        let called = 0;
        withHidePopover(function () { called += 1; });
        hideFromTopLayer(elementThatIsOpen(false));
        expect(called).toBe(0);
    });

    it('calls hidePopover on an open element', () => {
        let called = 0;
        withHidePopover(function () { called += 1; });
        hideFromTopLayer(elementThatIsOpen(true));
        expect(called).toBe(1);
    });

    it('tolerates a null element', () => {
        withHidePopover(() => {});
        expect(() => hideFromTopLayer(null)).not.toThrow();
        expect(() => hideFromTopLayer(undefined)).not.toThrow();
    });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PullToRefresh } from '../PullToRefresh';
import { PULL_THRESHOLD } from '../pullGestures';

const touch = (clientX: number, clientY: number) => ({ touches: [{ clientX, clientY }] });

const pull = (element: Element, distance: number, across = 0) => {
    fireEvent.touchStart(element, touch(0, 0));
    fireEvent.touchMove(element, touch(across, distance));
    fireEvent.touchEnd(element);
};

const indicator = (container: HTMLElement) =>
    container.querySelector('.pull-to-refresh')!;

/** A scroller the component sits inside, parked at `scrollTop`. */
const scroller = (scrollTop: number) => {
    const host = document.createElement('div');
    host.style.overflowY = 'auto';
    Object.defineProperty(host, 'scrollHeight', { value: 1000 });
    Object.defineProperty(host, 'clientHeight', { value: 400 });
    Object.defineProperty(host, 'scrollTop', { value: scrollTop, writable: true });
    document.body.appendChild(host);
    return host;
};

describe('PullToRefresh', () => {
    it('refreshes when pulled far enough from the top', async () => {
        const onRefresh = vi.fn().mockResolvedValue(undefined);
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>);

        pull(indicator(container), PULL_THRESHOLD * 2);

        await waitFor(() => expect(onRefresh).toHaveBeenCalledOnce());
    });

    it('does not refresh for a pull short of the threshold', () => {
        const onRefresh = vi.fn();
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>);

        pull(indicator(container), 8);

        expect(onRefresh).not.toHaveBeenCalled();
    });

    // The component is rarely the element that scrolls. Judged on its own
    // scrollTop it would arm halfway down a list, because that never leaves 0.
    it('does not refresh when the scroller it sits in is not at the top', () => {
        const onRefresh = vi.fn();
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>, {
            container: scroller(250),
        });

        pull(indicator(container), PULL_THRESHOLD * 2);

        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('refreshes when that scroller is at the top', async () => {
        const onRefresh = vi.fn().mockResolvedValue(undefined);
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>, {
            container: scroller(0),
        });

        pull(indicator(container), PULL_THRESHOLD * 2);

        await waitFor(() => expect(onRefresh).toHaveBeenCalledOnce());
    });

    it('leaves a sideways gesture to whatever handles swipes', () => {
        const onRefresh = vi.fn();
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>);

        pull(indicator(container), 20, 80);

        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('does nothing while disabled', () => {
        const onRefresh = vi.fn();
        const { container } = render(<PullToRefresh onRefresh={onRefresh} disabled>Rows</PullToRefresh>);

        pull(indicator(container), PULL_THRESHOLD * 2);

        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('names the indicator while it is refreshing', async () => {
        let finish: () => void = () => undefined;
        const onRefresh = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>);

        pull(indicator(container), PULL_THRESHOLD * 2);

        await waitFor(() => expect(screen.getByRole('status', { name: 'Refreshing' })).toBeInTheDocument());
        finish();
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    });

    it('stops refreshing when the refresh rejects', async () => {
        const onRefresh = vi.fn().mockRejectedValue(new Error('offline'));
        const { container } = render(<PullToRefresh onRefresh={onRefresh}>Rows</PullToRefresh>);

        pull(indicator(container), PULL_THRESHOLD * 2);

        await waitFor(() => expect(onRefresh).toHaveBeenCalledOnce());
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    });
});

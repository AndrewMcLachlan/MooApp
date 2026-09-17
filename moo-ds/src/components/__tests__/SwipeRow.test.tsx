import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SwipeRow } from '../SwipeRow';

const actions = (onAction = vi.fn()) => [
    { key: 'approve', label: 'Approve', onAction, variant: 'primary' },
];

describe('SwipeRow', () => {
    it('renders its content', () => {
        render(<SwipeRow actions={actions()}>Pull request 42</SwipeRow>);
        expect(screen.getByText('Pull request 42')).toBeInTheDocument();
    });

    // The swipe reveals the actions; it does not create them. Anyone on a
    // keyboard or a screen reader reaches them without performing a gesture.
    it('puts the actions in the document without a gesture', () => {
        render(<SwipeRow actions={actions()}>Row</SwipeRow>);
        expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    });

    it('runs an action when its button is pressed', async () => {
        const onAction = vi.fn();
        render(<SwipeRow actions={actions(onAction)}>Row</SwipeRow>);

        await userEvent.click(screen.getByRole('button', { name: 'Approve' }));

        expect(onAction).toHaveBeenCalledOnce();
    });

    it('does not run a disabled action', async () => {
        const onAction = vi.fn();
        render(<SwipeRow actions={[{ key: 'a', label: 'Approve', onAction, disabled: true }]}>Row</SwipeRow>);

        await userEvent.click(screen.getByRole('button', { name: 'Approve' }));

        expect(onAction).not.toHaveBeenCalled();
    });

    it('tints an action from its variant', () => {
        render(<SwipeRow actions={actions()}>Row</SwipeRow>);
        expect(screen.getByRole('button', { name: 'Approve' })).toHaveClass('swipe-row-action-primary');
    });

    it('renders nothing extra for a row with no actions', () => {
        render(<SwipeRow actions={[]}>Row</SwipeRow>);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});

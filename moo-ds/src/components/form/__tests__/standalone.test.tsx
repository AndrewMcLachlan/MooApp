import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Password } from '../Password';
import { Select } from '../Select';
import { TextArea } from '../TextArea';
import { Input } from '../Input';

// These are all exported from the package root with no non-form counterpart,
// so they get used on their own -- demoo's Inputs page renders a bare
// <Password />. Reaching into a form context that isn't there used to throw
// "Cannot destructure property 'register'" and take the whole page with it.
describe('form controls outside a Form', () => {
    it('renders Password without a form context', () => {
        expect(() => render(<Password aria-label="Password" />)).not.toThrow();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Select without a form context', () => {
        expect(() => render(
            <Select aria-label="Choose"><option>One</option></Select>
        )).not.toThrow();
        expect(screen.getByLabelText('Choose')).toBeInTheDocument();
    });

    it('renders TextArea without a form context', () => {
        expect(() => render(<TextArea aria-label="Notes" />)).not.toThrow();
        expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    });

    it('renders Input without a form context', () => {
        expect(() => render(<Input aria-label="Plain" />)).not.toThrow();
        expect(screen.getByLabelText('Plain')).toBeInTheDocument();
    });

    it('leaves a standalone control unmarked', () => {
        render(<Password aria-label="Password" />);
        expect(screen.getByLabelText('Password')).not.toHaveAttribute('aria-invalid');
    });
});

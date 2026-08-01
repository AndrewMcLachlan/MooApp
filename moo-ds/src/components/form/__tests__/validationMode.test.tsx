import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, type Resolver } from 'react-hook-form';
import { Form } from '../Form';

interface Signup { email: string; password: string; }

// The resolver always validates the whole object and returns every failure.
const resolver: Resolver<Signup> = async (values) => {
    const errors: Record<string, { type: string; message: string }> = {};
    if (!values.email.includes('@')) errors.email = { type: 'pattern', message: 'Bad email' };
    if (!values.password) errors.password = { type: 'required', message: 'Password is required' };
    return Object.keys(errors).length ? { values: {}, errors: errors as never } : { values, errors: {} };
};

const Signup = ({ mode }: { mode: 'onSubmit' | 'onTouched' }) => {
    const form = useForm<Signup>({ defaultValues: { email: '', password: '' }, resolver, mode });
    return (
        <Form form={form} onSubmit={() => { }}>
            <Form.Group groupId="email">
                <Form.Label>Email</Form.Label>
                <Form.Input />
                <Form.Feedback />
            </Form.Group>
            <Form.Group groupId="password">
                <Form.Label>Password</Form.Label>
                <Form.Input type="password" />
                <Form.Feedback />
            </Form.Group>
            <button type="submit">Save</button>
        </Form>
    );
};

describe('when untouched fields report errors', () => {
    it('onTouched: blurring one field flags only that field', async () => {
        render(<Signup mode="onTouched" />);
        const email = screen.getByLabelText('Email');
        fireEvent.change(email, { target: { value: 'nope' } });
        fireEvent.blur(email);

        await waitFor(() => expect(screen.getByText('Bad email')).toBeInTheDocument());
        expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });

    it('submitting flags every failing field, touched or not', async () => {
        render(<Signup mode="onTouched" />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => expect(screen.getByText('Bad email')).toBeInTheDocument());
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
});

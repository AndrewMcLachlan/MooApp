import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, type Resolver } from 'react-hook-form';
import { Form } from '../Form';

interface Values { name: string; }

// A resolver stands in for zod/yup: the form components own the register call,
// so rules reach react-hook-form this way rather than per-field. This one
// rejects an empty name, which is what submitting the harness produces.
const resolver: Resolver<Values> = async (values) =>
    values.name
        ? { values, errors: {} }
        : { values: {}, errors: { name: { type: 'required', message: 'Name is required' } } };

const Harness = ({ children }: { children?: React.ReactNode }) => {
    const form = useForm<Values>({ defaultValues: { name: '' }, resolver });
    return (
        <Form form={form} onSubmit={() => { }}>
            <Form.Group groupId="name">
                <Form.Label>Name</Form.Label>
                <Form.Input />
                <Form.Feedback>{children}</Form.Feedback>
            </Form.Group>
            <button type="submit">Save</button>
        </Form>
    );
};

const submit = () => fireEvent.click(screen.getByText('Save'));

describe('Form.Feedback', () => {
    it('renders nothing while the field is valid', () => {
        render(<Harness />);
        expect(document.querySelector('.invalid-feedback')).toBeNull();
        expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
    });

    it('renders the resolver message once validation has failed', async () => {
        render(<Harness />);
        submit();
        await waitFor(() => expect(screen.getByText('Name is required')).toHaveClass('invalid-feedback'));
    });

    it('marks the control invalid and points it at the message', async () => {
        render(<Harness />);
        submit();

        await waitFor(() => expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true'));

        const input = screen.getByLabelText('Name');
        expect(input).toHaveAttribute('aria-describedby', 'name-error');
        expect(screen.getByText('Name is required')).toHaveAttribute('id', 'name-error');
    });

    it('clears once the field becomes valid again', async () => {
        render(<Harness />);
        submit();
        await waitFor(() => expect(screen.getByText('Name is required')).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
        submit();

        await waitFor(() => expect(screen.queryByText('Name is required')).not.toBeInTheDocument());
        expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
    });

    it('lets children replace the wording without changing when it shows', async () => {
        render(<Harness>Please tell us your name</Harness>);
        expect(screen.queryByText('Please tell us your name')).not.toBeInTheDocument();

        submit();

        await waitFor(() => expect(screen.getByText('Please tell us your name')).toBeInTheDocument());
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });

    it('has displayName', () => {
        expect(Form.Feedback.displayName).toBe('Feedback');
    });
});

// A resolver validates the whole object, so submitting flags every failing
// field at once. What matters is that each message lands on its own group.
describe('Form.Feedback scoping', () => {
    interface Signup { email: string; password: string; }

    const signupResolver: Resolver<Signup> = async (values) => {
        const errors: Record<string, { type: string; message: string }> = {};
        if (!values.email) errors.email = { type: 'required', message: 'Email address is required' };
        else if (!values.email.includes('@')) errors.email = { type: 'pattern', message: "That doesn't look like an email address" };
        if (!values.password) errors.password = { type: 'required', message: 'Password is required' };
        return Object.keys(errors).length ? { values: {}, errors: errors as never } : { values, errors: {} };
    };

    const Signup = () => {
        const form = useForm<Signup>({ defaultValues: { email: '', password: '' }, resolver: signupResolver });
        return (
            <Form form={form} onSubmit={() => { }}>
                <Form.Group groupId="email">
                    <Form.Label>Email address</Form.Label>
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

    it('shows each field its own message, not a neighbour\'s', async () => {
        render(<Signup />);
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'nope' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => expect(screen.getByText("That doesn't look like an email address")).toBeInTheDocument());

        const emailGroup = screen.getByLabelText('Email address').closest('.form-group');
        const passwordGroup = screen.getByLabelText('Password').closest('.form-group');

        expect(emailGroup?.querySelector('.invalid-feedback')?.textContent).toBe("That doesn't look like an email address");
        expect(passwordGroup?.querySelector('.invalid-feedback')?.textContent).toBe('Password is required');
    });

    it('leaves a valid neighbour untouched', async () => {
        render(<Signup />);
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'nope' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter2' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => expect(screen.getByText("That doesn't look like an email address")).toBeInTheDocument());

        expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByLabelText('Password')).not.toHaveAttribute('aria-invalid');
        expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });
});

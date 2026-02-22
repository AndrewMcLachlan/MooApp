import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Form } from '../Form';

// Test wrapper component that provides react-hook-form
interface TestFormData {
  username: string;
  email: string;
  age?: number;
  agree?: boolean;
}

const TestForm = ({
  onSubmit = vi.fn(),
  defaultValues = {},
  layout = 'vertical' as const,
  children,
}: {
  onSubmit?: (data: TestFormData) => void;
  defaultValues?: Partial<TestFormData>;
  layout?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}) => {
  const form = useForm<TestFormData>({ defaultValues });

  return (
    <Form form={form} onSubmit={onSubmit} layout={layout}>
      {children}
    </Form>
  );
};

describe('Form', () => {
  describe('rendering', () => {
    it('renders form element', () => {
      const { container } = render(<TestForm />);

      // Form without name/aria-label doesn't have role="form"
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <TestForm>
          <div data-testid="child">Child content</div>
        </TestForm>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies default className', () => {
      const { container } = render(<TestForm />);

      expect(container.querySelector('form')).toHaveClass('form-container');
    });

    it('applies custom className', () => {
      // Use TestForm wrapper with custom children to test Form directly
      const CustomFormWrapper = () => {
        const form = useForm<TestFormData>();
        return (
          <Form form={form} onSubmit={() => {}} className="custom-form">
            Content
          </Form>
        );
      };

      const { container } = render(<CustomFormWrapper />);

      expect(container.querySelector('form')).toHaveClass('custom-form');
    });

    it('has displayName', () => {
      expect(Form.displayName).toBe('Form');
    });
  });

  describe('layout', () => {
    it('applies vertical layout class by default', () => {
      const { container } = render(<TestForm />);

      expect(container.querySelector('form')).toHaveClass('form-vertical');
    });

    it('applies horizontal layout class', () => {
      const { container } = render(<TestForm layout="horizontal" />);

      expect(container.querySelector('form')).toHaveClass('form-horizontal');
    });
  });

  describe('submission', () => {
    it('calls onSubmit when form is submitted', async () => {
      const onSubmit = vi.fn();

      render(
        <TestForm onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </TestForm>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    it('passes form data to onSubmit', async () => {
      const onSubmit = vi.fn();

      render(
        <TestForm onSubmit={onSubmit} defaultValues={{ username: 'testuser' }}>
          <button type="submit">Submit</button>
        </TestForm>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ username: 'testuser' }),
          expect.anything()
        );
      });
    });
  });

  describe('compound components', () => {
    it('has Group component', () => {
      expect(Form.Group).toBeDefined();
      expect(Form.Group.displayName).toBe('Group');
    });

    it('has Input component', () => {
      expect(Form.Input).toBeDefined();
      expect(Form.Input.displayName).toBe('Input');
    });

    it('has Label component', () => {
      expect(Form.Label).toBeDefined();
      expect(Form.Label.displayName).toBe('Label');
    });

    it('has Check component', () => {
      expect(Form.Check).toBeDefined();
      expect(Form.Check.displayName).toBe('Check');
    });

    it('has Select component', () => {
      expect(Form.Select).toBeDefined();
      expect(Form.Select.displayName).toBe('Select');
    });

    it('has Password component', () => {
      expect(Form.Password).toBeDefined();
      expect(Form.Password.displayName).toBe('Password');
    });

    it('has TextArea component', () => {
      expect(Form.TextArea).toBeDefined();
      expect(Form.TextArea.displayName).toBe('TextArea');
    });
  });
});

describe('Form.Group', () => {
  it('renders children', () => {
    render(
      <TestForm>
        <Form.Group groupId="test">
          <div data-testid="group-child">Content</div>
        </Form.Group>
      </TestForm>
    );

    expect(screen.getByTestId('group-child')).toBeInTheDocument();
  });

  it('applies form-group class', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="test">Content</Form.Group>
      </TestForm>
    );

    expect(container.querySelector('.form-group')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="test" className="custom-group">
          Content
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('.form-group')).toHaveClass('custom-group');
  });

  it('hides when show is false', () => {
    render(
      <TestForm>
        <Form.Group groupId="test" show={false}>
          <div data-testid="hidden-content">Hidden</div>
        </Form.Group>
      </TestForm>
    );

    expect(screen.queryByTestId('hidden-content')).not.toBeInTheDocument();
  });

  it('shows by default', () => {
    render(
      <TestForm>
        <Form.Group groupId="test">
          <div data-testid="visible-content">Visible</div>
        </Form.Group>
      </TestForm>
    );

    expect(screen.getByTestId('visible-content')).toBeInTheDocument();
  });
});

describe('Form.Label', () => {
  it('renders label element', () => {
    render(
      <TestForm>
        <Form.Group groupId="test">
          <Form.Label>Test Label</Form.Label>
        </Form.Group>
      </TestForm>
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies form-label class', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="test">
          <Form.Label>Label</Form.Label>
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('label')).toHaveClass('form-label');
  });

  it('links to input via htmlFor from group context', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="username">
          <Form.Label>Username</Form.Label>
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('label')).toHaveAttribute('for', 'username');
  });

  it('allows custom htmlFor', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="test">
          <Form.Label htmlFor="custom-id">Label</Form.Label>
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('label')).toHaveAttribute('for', 'custom-id');
  });
});

describe('Form.Input', () => {
  it('renders input element', () => {
    render(
      <TestForm>
        <Form.Group groupId="username">
          <Form.Input />
        </Form.Group>
      </TestForm>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies form-control class', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="username">
          <Form.Input />
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('input')).toHaveClass('form-control');
  });

  it('uses groupId as input id', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="email">
          <Form.Input />
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('input')).toHaveAttribute('id', 'email');
  });

  it('allows custom id', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="test">
          <Form.Input id="custom-input" />
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('input')).toHaveAttribute('id', 'custom-input');
  });

  it('applies form-check-input class for checkbox type', () => {
    const { container } = render(
      <TestForm>
        <Form.Group groupId="agree">
          <Form.Input type="checkbox" />
        </Form.Group>
      </TestForm>
    );

    expect(container.querySelector('input')).toHaveClass('form-check-input');
  });
});

describe('Form integration', () => {
  it('renders complete form with all components', () => {
    render(
      <TestForm>
        <Form.Group groupId="username">
          <Form.Label>Username</Form.Label>
          <Form.Input placeholder="Enter username" />
        </Form.Group>
        <Form.Group groupId="email">
          <Form.Label>Email</Form.Label>
          <Form.Input type="email" placeholder="Enter email" />
        </Form.Group>
        <button type="submit">Submit</button>
      </TestForm>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});

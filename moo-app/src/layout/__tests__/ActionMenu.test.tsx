import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionMenu } from '../ActionMenu';

vi.mock('@andrewmclachlan/moo-ds', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@andrewmclachlan/moo-ds')>()),
  useLink: () => ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

const open = () => fireEvent.click(screen.getByRole('button', { name: 'More actions' }));

describe('ActionMenu', () => {
  it('renders nothing when there are no actions', () => {
    const { container } = render(<ActionMenu actions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a single action as a button instead of a menu', () => {
    const onClick = vi.fn();
    render(<ActionMenu actions={[{ id: 'import', label: 'Import', onClick }]} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('names a single icon action by its label', () => {
    render(<ActionMenu actions={[{ id: 'add', label: 'Add transaction', icon: 'plus', onClick: vi.fn() }]} />);
    const button = screen.getByRole('button', { name: 'Add transaction' });
    expect(button).not.toHaveTextContent('Add transaction');
  });

  it('keeps a single link action as a link', () => {
    render(<ActionMenu actions={[{ id: 'add', label: 'Add', to: '/add' }]} />);
    expect(screen.getByRole('link', { name: 'Add' })).toHaveAttribute('href', '/add');
  });

  it('renders a disabled single link as a disabled button', () => {
    render(<ActionMenu actions={[{ id: 'add', label: 'Add', to: '/add', disabled: true }]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('keeps a single toggle in the menu', () => {
    render(<ActionMenu actions={[{ id: 'net', label: 'Show net amount', checked: true, onClick: vi.fn() }]} />);
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('renders an item per action', () => {
    render(<ActionMenu actions={[
      { id: 'import', label: 'Import', onClick: vi.fn() },
      { id: 'add', label: 'Add transaction', onClick: vi.fn() },
    ]} />);
    open();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Add transaction')).toBeInTheDocument();
  });

  it('calls the action when its item is chosen', () => {
    const onClick = vi.fn();
    render(<ActionMenu actions={[
      { id: 'import', label: 'Import', onClick },
      { id: 'add', label: 'Add transaction', onClick: vi.fn() },
    ]} />);
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a toggle action as checked', () => {
    render(<ActionMenu actions={[{ id: 'net', label: 'Show net amount', checked: true, onClick: vi.fn() }]} />);
    open();
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('puts write actions below a separator, whatever order they arrive in', () => {
    const { baseElement } = render(<ActionMenu actions={[
      { id: 'import', label: 'Import', group: 'write', onClick: vi.fn() },
      { id: 'net', label: 'Show net amount', checked: false, onClick: vi.fn() },
    ]} />);
    open();
    const items = [...baseElement.querySelectorAll('.menu-item, .divider')]
      .map(el => el.classList.contains('divider') ? '---' : el.textContent);
    expect(items).toEqual(['Show net amount', '---', 'Import']);
  });

  it('omits the separator when every action is in one group', () => {
    const { baseElement } = render(<ActionMenu actions={[
      { id: 'net', label: 'Show net amount', checked: false, onClick: vi.fn() },
    ]} />);
    open();
    expect(baseElement.querySelector('.divider')).not.toBeInTheDocument();
  });
});

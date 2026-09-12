import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from '../Menu';
import { LinkProvider } from '../../providers';

const open = () => fireEvent.click(screen.getByRole('button', { name: 'Open' }));

// Only a Menu containing links needs this; the other tests prove a Menu works
// with no provider in the tree.
const withLinks = (ui: React.ReactNode) => (
  <LinkProvider
    LinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
    NavLinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
  >
    {ui}
  </LinkProvider>
);

describe('Menu', () => {
  it('does not render its items until the trigger is clicked', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    expect(screen.queryByText('Import')).not.toBeInTheDocument();
  });

  it('renders its items once opened', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('calls onClick when an item is chosen', () => {
    const onClick = vi.fn();
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={onClick}>Import</Menu.Item>
      </Menu>
    );
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks an item with checked as a checkbox item', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item checked onClick={vi.fn()}>Show net amount</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('leaves an item without checked as a plain menuitem', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('does not call onClick for a disabled item', () => {
    const onClick = vi.fn();
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item disabled onClick={onClick}>Import</Menu.Item>
      </Menu>
    );
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an item with a destination as a link', () => {
    render(withLinks(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item to="/settings/families/add">Add family</Menu.Item>
      </Menu>
    ));
    open();
    expect(screen.getByRole('menuitem')).toHaveAttribute('href', '/settings/families/add');
  });

  it('gives a command a focusable control', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('menuitem').tagName).toBe('BUTTON');
  });

  it('renders a divider as a separator', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Show net amount</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

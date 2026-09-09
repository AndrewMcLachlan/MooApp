import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkProvider } from '@andrewmclachlan/moo-ds';
import { PageActionControl } from '../PageActionControl';

// IconLinkButton calls useLink, which throws with no provider above it.
const withLinks = (ui: React.ReactNode) => (
  <LinkProvider
    LinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
    NavLinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
  >
    {ui}
  </LinkProvider>
);

describe('PageActionControl', () => {
  it('renders a command as a button and calls onClick', () => {
    const onClick = vi.fn();
    render(<PageActionControl action={{ id: 'import', label: 'Import', onClick }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an action with checked as a switch', () => {
    render(<PageActionControl action={{ id: 'show-net', label: 'Show net amount', checked: true, onClick: vi.fn() }} />);
    expect(screen.getByRole('switch', { name: 'Show net amount' })).toBeChecked();
  });

  it('toggles through onClick', () => {
    const onClick = vi.fn();
    render(<PageActionControl action={{ id: 'show-net', label: 'Show net amount', checked: false, onClick }} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Show net amount' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a destination as a link', () => {
    render(withLinks(<PageActionControl action={{ id: 'add-family', label: 'Add family', to: '/settings/families/add' }} />));
    expect(screen.getByRole('link', { name: 'Add family' })).toHaveAttribute('href', '/settings/families/add');
  });

  it('disables a disabled action', () => {
    render(<PageActionControl action={{ id: 'import', label: 'Import', disabled: true, onClick: vi.fn() }} />);
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
  });
});

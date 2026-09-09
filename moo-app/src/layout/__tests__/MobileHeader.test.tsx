import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Mobile/Header';

const mockSetShowSidebar = vi.fn();
const mockUseLayout = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
  useApp: () => ({ name: 'Test App' }),
}));

vi.mock('@andrewmclachlan/moo-ds', () => ({
  MenuToggle: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="menu-toggle" onClick={onClick}>Toggle</button>
  ),
}));

vi.mock('../ActionMenu', () => ({
  ActionMenu: ({ actions }: { actions: unknown[] }) =>
    actions.length > 0 ? <button type="button" aria-label="More actions">More</button> : null,
}));

const layout = (overrides: Record<string, unknown> = {}) => {
  mockUseLayout.mockReturnValue({
    breadcrumbs: [],
    actions: [],
    customActions: [],
    setShowSidebar: mockSetShowSidebar,
    ...overrides,
  });
};

describe('Mobile Header', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockSetShowSidebar.mockClear();
  });

  it('renders only the last breadcrumb as the title', () => {
    layout({ breadcrumbs: [
      { text: 'Home', route: '/' },
      { text: 'Accounts', route: '/accounts' },
      { text: 'Joint Savings', route: '/accounts/1' },
    ] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Joint Savings');
    expect(screen.queryByText('Accounts')).not.toBeInTheDocument();
  });

  it('opens the drawer from the toggle', () => {
    layout();
    render(<Header menu={[]} />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(mockSetShowSidebar).toHaveBeenCalledWith(true);
  });

  it('gives described actions to the menu rather than the bar', () => {
    layout({ actions: [{ id: 'import', label: 'Import', onClick: vi.fn() }] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
    expect(screen.queryByText('Import')).not.toBeInTheDocument();
  });

  it('renders custom actions in the bar', () => {
    layout({ customActions: [<button key="s" type="button">Search</button>] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders no menu when there are no actions', () => {
    layout({ actions: [] });
    render(<Header menu={[]} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });
});

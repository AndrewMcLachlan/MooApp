import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageProvider } from '../providers/MessageProvider';
import { LinkProvider } from '../providers/LinkProvider';
import { LinkComponent, NavLinkComponent } from '../models/LinkComponents';

/**
 * Mock Link component for testing
 * Renders as an anchor tag with the same props
 */
const MockLink: LinkComponent = ({ to, href, children, className, ...props }) => (
  <a href={to ?? href} className={className as string} {...props}>
    {children}
  </a>
);

/**
 * Mock NavLink component for testing
 * Renders as an anchor tag with the same props
 */
const MockNavLink: NavLinkComponent = ({ to, href, children, className, ...props }) => {
  const resolvedClassName = typeof className === 'function' ? className({ isActive: false }) : className;
  return (
    <a href={to ?? href} className={resolvedClassName} {...props}>
      {children}
    </a>
  );
};

interface AllProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides all moo-ds contexts
 * Used by customRender to wrap test components
 */
const AllProviders = ({ children }: AllProvidersProps) => (
  <ThemeProvider>
    <MessageProvider>
      <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
        {children}
      </LinkProvider>
    </MessageProvider>
  </ThemeProvider>
);

/**
 * Custom render function that wraps components with all moo-ds providers
 * Use this instead of @testing-library/react render for component tests
 *
 * @example
 * ```tsx
 * import { render, screen } from '../test-utils';
 *
 * it('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

/**
 * Renders a component with only MessageProvider
 * Useful for testing components that only need message context
 */
export const renderWithMessages = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MessageProvider, ...options });

/**
 * Renders a component with only ThemeProvider
 * Useful for testing theme-dependent components in isolation
 */
export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: ThemeProvider, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Export custom render as default render
export { customRender as render };

// Export mock components for custom wrapper scenarios
export { MockLink, MockNavLink };

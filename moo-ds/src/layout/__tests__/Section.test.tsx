import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from '../Section/Section';
import { LinkProvider } from '../../providers/LinkProvider';
import { LinkComponent, NavLinkComponent } from '../../models';

// Mock Link components
const MockLink: LinkComponent = ({ to, children, className, ...rest }) => (
  <a href={to} className={className} data-testid="mock-link" {...rest}>
    {children}
  </a>
);

const MockNavLink: NavLinkComponent = ({ to, children }) => (
  <a href={to} data-testid="mock-navlink">{children}</a>
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
    {children}
  </LinkProvider>
);

describe('Section', () => {
  describe('basic rendering', () => {
    it('renders section element', () => {
      const { container } = render(
        <Section>Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <Section>
          <div data-testid="child">Child content</div>
        </Section>,
        { wrapper }
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies section class', () => {
      const { container } = render(
        <Section>Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('section')).toHaveClass('section');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Section className="custom-class">Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('section')).toHaveClass('section', 'custom-class');
    });

    it('passes through additional props', () => {
      const { container } = render(
        <Section data-testid="my-section" id="section-1">Content</Section>,
        { wrapper }
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('data-testid', 'my-section');
      expect(section).toHaveAttribute('id', 'section-1');
    });
  });

  describe('header prop', () => {
    it('renders string header as heading', () => {
      render(
        <Section header="My Section">Content</Section>,
        { wrapper }
      );

      expect(screen.getByRole('heading', { name: 'My Section' })).toBeInTheDocument();
    });

    it('renders h2 by default', () => {
      const { container } = render(
        <Section header="My Section">Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('renders custom heading size', () => {
      const { container } = render(
        <Section header="My Section" headerSize={3}>Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('h2')).not.toBeInTheDocument();
    });

    it('renders all heading sizes correctly', () => {
      const sizes: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6];

      sizes.forEach(size => {
        const { container } = render(
          <Section header="Test" headerSize={size}>Content</Section>,
          { wrapper }
        );

        expect(container.querySelector(`h${size}`)).toBeInTheDocument();
      });
    });

    it('applies section-header class to heading', () => {
      const { container } = render(
        <Section header="My Section">Content</Section>,
        { wrapper }
      );

      expect(container.querySelector('.section-header')).toBeInTheDocument();
    });

    it('renders ReactNode header directly', () => {
      render(
        <Section header={<span data-testid="custom-header">Custom Header</span>}>
          Content
        </Section>,
        { wrapper }
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('renders without header when not provided', () => {
      const { container } = render(
        <Section>Content only</Section>,
        { wrapper }
      );

      expect(container.querySelector('h1, h2, h3, h4, h5, h6')).not.toBeInTheDocument();
    });
  });

  describe('to prop (linked header)', () => {
    it('wraps header in link when to prop is provided', () => {
      render(
        <Section header="Linked Section" to="/some-path">Content</Section>,
        { wrapper }
      );

      const link = screen.getByTestId('mock-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/some-path');
      expect(link).toHaveTextContent('Linked Section');
    });

    it('does not wrap header in link when to prop is not provided', () => {
      render(
        <Section header="Plain Section">Content</Section>,
        { wrapper }
      );

      expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument();
    });
  });

  describe('compound components', () => {
    describe('Section.Body', () => {
      it('renders body content', () => {
        render(
          <Section>
            <Section.Body>
              <p>Body content</p>
            </Section.Body>
          </Section>,
          { wrapper }
        );

        expect(screen.getByText('Body content')).toBeInTheDocument();
      });

      it('applies body class', () => {
        const { container } = render(
          <Section>
            <Section.Body>Content</Section.Body>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('.body')).toBeInTheDocument();
      });
    });

    describe('Section.Header', () => {
      it('renders header content', () => {
        render(
          <Section>
            <Section.Header>
              <span>Header content</span>
            </Section.Header>
          </Section>,
          { wrapper }
        );

        expect(screen.getByText('Header content')).toBeInTheDocument();
      });

      it('applies header class', () => {
        const { container } = render(
          <Section>
            <Section.Header>Header</Section.Header>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('.header')).toBeInTheDocument();
      });
    });

    describe('Section.Subheading', () => {
      it('renders subheading content', () => {
        render(
          <Section>
            <Section.Subheading>Subheading text</Section.Subheading>
          </Section>,
          { wrapper }
        );

        expect(screen.getByText('Subheading text')).toBeInTheDocument();
      });

      it('renders h3 by default', () => {
        const { container } = render(
          <Section>
            <Section.Subheading>Subheading</Section.Subheading>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('h3')).toBeInTheDocument();
      });

      it('renders custom subheading size', () => {
        const { container } = render(
          <Section>
            <Section.Subheading size={4}>Subheading</Section.Subheading>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('h4')).toBeInTheDocument();
      });

      it('applies subheading class', () => {
        const { container } = render(
          <Section>
            <Section.Subheading>Subheading</Section.Subheading>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('.subheading')).toBeInTheDocument();
      });
    });

    describe('combined usage', () => {
      it('renders full section structure', () => {
        const { container } = render(
          <Section header="Main Title" headerSize={1}>
            <Section.Header>
              <button>Action</button>
            </Section.Header>
            <Section.Subheading size={2}>Subtitle</Section.Subheading>
            <Section.Body>
              <p>Main content goes here</p>
            </Section.Body>
          </Section>,
          { wrapper }
        );

        expect(container.querySelector('h1')).toHaveTextContent('Main Title');
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        expect(container.querySelector('h2.subheading')).toHaveTextContent('Subtitle');
        expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      });
    });
  });
});

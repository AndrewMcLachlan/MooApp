import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { Widget } from '../Widget';

describe('Widget', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Widget size="single">Widget Content</Widget>);

      expect(screen.getByText('Widget Content')).toBeInTheDocument();
    });

    it('renders with header', () => {
      render(<Widget size="single" header="Widget Title">Content</Widget>);

      expect(screen.getByText('Widget Title')).toBeInTheDocument();
    });

    it('renders header as ReactNode', () => {
      render(
        <Widget size="single" header={<span data-testid="custom-header">Custom Header</span>}>
          Content
        </Widget>
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows spinner when loading', () => {
      const { container } = render(<Widget size="single" loading>Content</Widget>);

      expect(container.querySelector('.spinner-container')).toBeInTheDocument();
    });

    it('hides children when loading', () => {
      render(<Widget size="single" loading>Hidden Content</Widget>);

      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('shows children when not loading', () => {
      render(<Widget size="single" loading={false}>Visible Content</Widget>);

      expect(screen.getByText('Visible Content')).toBeInTheDocument();
    });

    it('defaults loading to false', () => {
      const { container } = render(<Widget size="single">Default Content</Widget>);

      expect(screen.getByText('Default Content')).toBeInTheDocument();
      expect(container.querySelector('.spinner-container')).not.toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('applies single class', () => {
      const { container } = render(<Widget size="single">Content</Widget>);

      expect(container.querySelector('.single')).toBeInTheDocument();
    });

    it('applies double class', () => {
      const { container } = render(<Widget size="double">Content</Widget>);

      expect(container.querySelector('.double')).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders in a Col container', () => {
      const { container } = render(<Widget size="single">Content</Widget>);

      // Bootstrap Col renders with responsive classes like col-xxl-4
      expect(container.querySelector('[class*="col-"]')).toBeInTheDocument();
    });

    it('applies responsive column classes', () => {
      const { container } = render(<Widget size="single">Content</Widget>);

      const col = container.querySelector('[class*="col-xxl"]');
      expect(col).toBeInTheDocument();
    });
  });

  describe('Section wrapper', () => {
    it('wraps content in Section component', () => {
      const { container } = render(<Widget size="single">Content</Widget>);

      expect(container.querySelector('.section')).toBeInTheDocument();
    });

    it('passes header to Section', () => {
      render(<Widget size="single" header="Test Header">Content</Widget>);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    it('passes headerSize to Section', () => {
      const { container } = render(
        <Widget size="single" header="Title" headerSize={3}>Content</Widget>
      );

      expect(container.querySelector('h3')).toBeInTheDocument();
    });
  });

  describe('to prop', () => {
    it('passes to prop for linkable widget', () => {
      render(<Widget size="single" to="/link" header="Linked Widget">Content</Widget>);

      // Widget should render, the Section handles the link
      expect(screen.getByText('Linked Widget')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('passes className through', () => {
      const { container } = render(
        <Widget size="single" className="custom-widget">Content</Widget>
      );

      expect(container.querySelector('.custom-widget')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Widget.displayName).toBe('Widget');
    });
  });
});

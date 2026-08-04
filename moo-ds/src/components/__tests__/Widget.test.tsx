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

  describe('refreshing state', () => {
    it('shows the edge bar and keeps children mounted', () => {
      const { container } = render(<Widget size="single" refreshing>Live Content</Widget>);

      expect(screen.getByRole('progressbar')).toHaveClass('progress-indeterminate-edge');
      expect(screen.getByText('Live Content')).toBeInTheDocument();
      expect(container.querySelector('.spinner-container')).not.toBeInTheDocument();
    });

    it('dims the section rather than wrapping the body', () => {
      const { container } = render(<Widget size="single" refreshing>Content</Widget>);

      expect(container.querySelector('.section')).toHaveClass('is-refreshing');
    });

    it('defaults refreshing to false', () => {
      render(<Widget size="single">Content</Widget>);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('lets loading win when both are set', () => {
      const { container } = render(
        <Widget size="single" loading refreshing>Hidden Content</Widget>
      );

      expect(container.querySelector('.spinner-container')).toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
      expect(container.querySelector('.section')).not.toHaveClass('is-refreshing');
    });

    it('keeps a custom className alongside is-refreshing', () => {
      const { container } = render(
        <Widget size="single" className="custom-widget" refreshing>Content</Widget>
      );

      expect(container.querySelector('.section')).toHaveClass('custom-widget', 'is-refreshing');
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
    it('renders in a div container with size class', () => {
      const { container } = render(<Widget size="single">Content</Widget>);

      const wrapper = container.firstElementChild;
      expect(wrapper?.tagName).toBe('DIV');
      expect(wrapper).toHaveClass('single');
    });

    it('renders double size in a div with double class', () => {
      const { container } = render(<Widget size="double">Content</Widget>);

      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass('double');
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

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tab } from '../Tab';

describe('Tab', () => {

  describe('Tab.Container', () => {
    it('renders children', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab One">Content One</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByText('Content One')).toBeInTheDocument();
    });

    it('generates nav tabs from panes', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders tablist role', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab One">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('marks defaultActiveKey tab as active', () => {
      render(
        <Tab.Container defaultActiveKey="two">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('One')).not.toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Tab.Container.displayName).toBe('Tab.Container');
    });
  });

  describe('Tab.Content', () => {
    it('renders with tab-content class', () => {
      const { container } = render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(container.querySelector('.tab-content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content className="custom">
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(container.querySelector('.tab-content.custom')).toBeInTheDocument();
    });

    it('only renders the active pane', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Active Content</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Inactive Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByText('Active Content')).toBeInTheDocument();
      expect(screen.queryByText('Inactive Content')).not.toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Tab.Content.displayName).toBe('Tab.Content');
    });
  });

  describe('Tab.Pane', () => {
    it('renders with tab-pane class', () => {
      const { container } = render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(container.querySelector('.tab-pane')).toBeInTheDocument();
    });

    it('renders with tabpanel role', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('active pane has active class', () => {
      const { container } = render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(container.querySelector('.tab-pane.active')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab" className="custom">Content</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(container.querySelector('.tab-pane.custom')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Tab.Pane.displayName).toBe('Tab.Pane');
    });
  });

  describe('tab switching', () => {
    it('switches active pane when tab is clicked', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Content Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.getByText('Content One')).toBeInTheDocument();
      expect(screen.queryByText('Content Two')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Second'));

      expect(screen.queryByText('Content One')).not.toBeInTheDocument();
      expect(screen.getByText('Content Two')).toBeInTheDocument();
    });

    it('does not switch to disabled tab', () => {
      render(
        <Tab.Container defaultActiveKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second" disabled>Content Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(screen.getByText('Content One')).toBeInTheDocument();
      expect(screen.queryByText('Content Two')).not.toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('uses activeKey prop', () => {
      render(
        <Tab.Container activeKey="two">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Content Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      expect(screen.queryByText('Content One')).not.toBeInTheDocument();
      expect(screen.getByText('Content Two')).toBeInTheDocument();
    });

    it('calls onSelect when tab is clicked', () => {
      const onSelect = vi.fn();
      render(
        <Tab.Container activeKey="one" onSelect={onSelect}>
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Content Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(onSelect).toHaveBeenCalledWith('two');
    });

    it('does not change active pane without activeKey update', () => {
      render(
        <Tab.Container activeKey="one">
          <Tab.Content>
            <Tab.Pane eventKey="one" title="First">Content One</Tab.Pane>
            <Tab.Pane eventKey="two" title="Second">Content Two</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(screen.getByText('Content One')).toBeInTheDocument();
    });
  });

  describe('context requirement', () => {
    it('Tab.Content throws outside Tab.Container', () => {
      expect(() => {
        render(
          <Tab.Content>
            <Tab.Pane eventKey="one" title="Tab">Content</Tab.Pane>
          </Tab.Content>
        );
      }).toThrow('Tab components must be used within a Tab.Container');
    });
  });
});

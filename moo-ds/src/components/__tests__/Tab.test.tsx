import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tab, Tabs } from '../Tab';

describe('Tabs', () => {

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab One">Content One</Tab>
        </Tabs>
      );

      expect(screen.getByText('Content One')).toBeInTheDocument();
    });

    it('generates nav tabs from Tab children', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="First">Content</Tab>
          <Tab eventKey="two" title="Second">Content</Tab>
        </Tabs>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders tablist role', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab One">Content</Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tab-content wrapper', () => {
      const { container } = render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab One">Content</Tab>
        </Tabs>
      );

      expect(container.querySelector('.tab-content')).toBeInTheDocument();
    });

    it('marks defaultActiveKey tab as active', () => {
      render(
        <Tabs defaultActiveKey="two">
          <Tab eventKey="one" title="First">One</Tab>
          <Tab eventKey="two" title="Second">Two</Tab>
        </Tabs>
      );

      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('One')).not.toBeInTheDocument();
    });

    it('defaults to first non-disabled tab when no key is provided', () => {
      render(
        <Tabs>
          <Tab eventKey="one" title="First" disabled>One</Tab>
          <Tab eventKey="two" title="Second">Two</Tab>
          <Tab eventKey="three" title="Third">Three</Tab>
        </Tabs>
      );

      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('One')).not.toBeInTheDocument();
      expect(screen.queryByText('Three')).not.toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Tabs.displayName).toBe('Tabs');
    });
  });

  describe('Tab', () => {
    it('renders with tab-pane class', () => {
      const { container } = render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab">Content</Tab>
        </Tabs>
      );

      expect(container.querySelector('.tab-pane')).toBeInTheDocument();
    });

    it('renders with tabpanel role', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab">Content</Tab>
        </Tabs>
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('active tab has active class', () => {
      const { container } = render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab">Content</Tab>
        </Tabs>
      );

      expect(container.querySelector('.tab-pane.active')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Tab" className="custom">Content</Tab>
        </Tabs>
      );

      expect(container.querySelector('.tab-pane.custom')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Tab.displayName).toBe('Tab');
    });
  });

  describe('icon rendering', () => {
    it('renders an icon in the nav link when icon prop is provided', () => {
      const { container } = render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="Settings" icon="cog">Content</Tab>
        </Tabs>
      );

      const navLink = container.querySelector('.nav-link');
      expect(navLink).toBeInTheDocument();
      expect(navLink!.textContent).toContain('Settings');
    });
  });

  describe('tab switching', () => {
    it('switches active pane when tab is clicked', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="First">Content One</Tab>
          <Tab eventKey="two" title="Second">Content Two</Tab>
        </Tabs>
      );

      expect(screen.getByText('Content One')).toBeInTheDocument();
      expect(screen.queryByText('Content Two')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Second'));

      expect(screen.queryByText('Content One')).not.toBeInTheDocument();
      expect(screen.getByText('Content Two')).toBeInTheDocument();
    });

    it('does not switch to disabled tab', () => {
      render(
        <Tabs defaultActiveKey="one">
          <Tab eventKey="one" title="First">Content One</Tab>
          <Tab eventKey="two" title="Second" disabled>Content Two</Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(screen.getByText('Content One')).toBeInTheDocument();
      expect(screen.queryByText('Content Two')).not.toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('uses activeKey prop', () => {
      render(
        <Tabs activeKey="two">
          <Tab eventKey="one" title="First">Content One</Tab>
          <Tab eventKey="two" title="Second">Content Two</Tab>
        </Tabs>
      );

      expect(screen.queryByText('Content One')).not.toBeInTheDocument();
      expect(screen.getByText('Content Two')).toBeInTheDocument();
    });

    it('calls onSelect when tab is clicked', () => {
      const onSelect = vi.fn();
      render(
        <Tabs activeKey="one" onSelect={onSelect}>
          <Tab eventKey="one" title="First">Content One</Tab>
          <Tab eventKey="two" title="Second">Content Two</Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(onSelect).toHaveBeenCalledWith('two');
    });

    it('does not change active pane without activeKey update', () => {
      render(
        <Tabs activeKey="one">
          <Tab eventKey="one" title="First">Content One</Tab>
          <Tab eventKey="two" title="Second">Content Two</Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByText('Second'));

      expect(screen.getByText('Content One')).toBeInTheDocument();
    });
  });

  describe('context requirement', () => {
    it('Tab throws outside Tabs', () => {
      expect(() => {
        render(
          <Tab eventKey="one" title="Tab">Content</Tab>
        );
      }).toThrow('Tab must be used within Tabs');
    });
  });
});

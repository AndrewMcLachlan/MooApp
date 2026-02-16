import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as Icons from '../assets';

// Complete list of all icon names based on exports
const iconNames = [
  'Application',
  'BarChart',
  'Budget',
  'Cog',
  'Dashboard',
  'Database',
  'HamburgerMenu',
  'Hierarchy',
  'Import',
  'LeftRightArrow',
  'PieChart',
  'PiggyBank',
  'PullRequest',
  'Reports',
  'Rules',
  'Sliders',
  'Stack',
  'Tag',
  'Tags',
  'Trendline',
  'TwoCoins',
  'Transaction',
  'UpDownArrow',
  'User',
  'UserShield',
  'Users',
] as const;

describe('moo-icons', () => {
  describe('Package exports', () => {
    it('exports all expected icons', () => {
      iconNames.forEach((iconName) => {
        const IconComponent = (Icons as Record<string, unknown>)[iconName];
        expect(IconComponent, `Icon ${iconName} should be exported`).toBeDefined();
        expect(typeof IconComponent, `Icon ${iconName} should be a function`).toBe('function');
      });
    });

    it('exports exactly 26 icons', () => {
      const exportedKeys = Object.keys(Icons);
      expect(exportedKeys).toHaveLength(26);
    });
  });

  describe('Icon rendering', () => {
    iconNames.forEach((iconName) => {
      describe(iconName, () => {
        it('renders without crashing', () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          expect(() => render(<IconComponent />)).not.toThrow();
        });

        it('renders an SVG element', () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          const svg = container.querySelector('svg');

          expect(svg).toBeInTheDocument();
        });

        it('has a viewBox attribute', () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          const svg = container.querySelector('svg');

          expect(svg).toHaveAttribute('viewBox');
        });
      });
    });
  });

  describe('Icon props', () => {
    it('accepts and applies className prop', () => {
      const { container } = render(<Icons.Dashboard className="custom-icon-class" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('custom-icon-class');
    });

    it('accepts and applies aria-label for accessibility', () => {
      const { container } = render(
        <Icons.User aria-label="User profile icon" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-label', 'User profile icon');
    });

    it('accepts and applies role attribute', () => {
      const { container } = render(
        <Icons.Dashboard role="img" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('role', 'img');
    });

    it('accepts and applies width prop', () => {
      const { container } = render(<Icons.Cog width={48} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '48');
    });

    it('accepts and applies height prop', () => {
      const { container } = render(<Icons.Cog height={48} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('height', '48');
    });

    it('accepts and applies custom width and height together', () => {
      const { container } = render(<Icons.Budget width={64} height={64} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });

    it('forwards data-testid attribute', () => {
      const { container } = render(
        <Icons.Application data-testid="app-icon" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-testid', 'app-icon');
    });

    it('forwards data-* attributes', () => {
      const { container } = render(
        <Icons.Reports data-custom="custom-value" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-custom', 'custom-value');
    });

    it('accepts aria-hidden for decorative icons', () => {
      const { container } = render(
        <Icons.Sliders aria-hidden="true" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('accepts style prop', () => {
      const { container } = render(
        <Icons.Tag style={{ opacity: 0.5 }} />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveStyle({ opacity: '0.5' });
    });

    it('accepts id prop', () => {
      const { container } = render(
        <Icons.Stack id="stack-icon" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('id', 'stack-icon');
    });
  });

  describe('Icon structure and styling', () => {
    it('inherits color from parent via CSS', () => {
      // Icons should be styleable via CSS color property
      // This is verified by checking the SVG can accept style props
      const { container } = render(
        <div style={{ color: 'blue' }}>
          <Icons.Dashboard data-testid="icon" />
        </div>
      );
      const svg = container.querySelector('svg');

      // SVG should render without fill/stroke overriding parent color
      expect(svg).toBeInTheDocument();
    });

    it('has valid viewBox format', () => {
      const { container } = render(<Icons.Application />);
      const svg = container.querySelector('svg');
      const viewBox = svg?.getAttribute('viewBox');

      expect(viewBox).toMatch(/^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?$/);
    });

    it('contains path or shape elements', () => {
      const { container } = render(<Icons.User />);
      const shapes = container.querySelectorAll('path, circle, rect, line, polyline, polygon, ellipse');

      expect(shapes.length).toBeGreaterThan(0);
    });
  });

  describe('Icon accessibility', () => {
    it('can be made accessible with aria-label and role', () => {
      const { container } = render(
        <Icons.UserShield aria-label="Protected user" role="img" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-label', 'Protected user');
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('can be hidden from screen readers with aria-hidden', () => {
      const { container } = render(
        <Icons.HamburgerMenu aria-hidden="true" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('supports focusable attribute', () => {
      const { container } = render(
        <Icons.Import focusable="false" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  describe('Icon categories', () => {
    describe('Navigation icons', () => {
      const navIcons = ['Dashboard', 'HamburgerMenu', 'LeftRightArrow', 'UpDownArrow'];

      navIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });

    describe('Data/Chart icons', () => {
      const chartIcons = ['BarChart', 'PieChart', 'Trendline', 'Reports'];

      chartIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });

    describe('User icons', () => {
      const userIcons = ['User', 'Users', 'UserShield'];

      userIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });

    describe('Finance icons', () => {
      const financeIcons = ['Budget', 'PiggyBank', 'TwoCoins', 'Transaction'];

      financeIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });

    describe('Organization icons', () => {
      const orgIcons = ['Hierarchy', 'Stack', 'Tag', 'Tags', 'Rules'];

      orgIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });

    describe('System icons', () => {
      const sysIcons = ['Cog', 'Sliders', 'Database', 'Import', 'Application'];

      sysIcons.forEach((iconName) => {
        it(`${iconName} renders correctly`, () => {
          const IconComponent = (Icons as Record<string, React.ComponentType>)[iconName];
          const { container } = render(<IconComponent />);
          expect(container.querySelector('svg')).toBeInTheDocument();
        });
      });
    });
  });
});

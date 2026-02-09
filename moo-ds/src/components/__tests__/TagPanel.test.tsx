import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagPanel } from '../TagPanel';

interface Tag {
  id: number;
  name: string;
  color?: string;
}

const mockTags: Tag[] = [
  { id: 1, name: 'Tag 1' },
  { id: 2, name: 'Tag 2' },
  { id: 3, name: 'Tag 3' },
];

const defaultProps = {
  items: mockTags,
  selectedItems: [mockTags[0]],
  labelField: (t: Tag) => t.name,
  valueField: (t: Tag) => t.id,
};

describe('TagPanel', () => {
  describe('rendering', () => {
    it('renders tag panel', () => {
      const { container } = render(<TagPanel {...defaultProps} />);

      expect(container.querySelector('.tag-panel')).toBeInTheDocument();
    });

    it('renders selected items', () => {
      render(<TagPanel {...defaultProps} selectedItems={[mockTags[0]]} />);

      expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<TagPanel {...defaultProps} className="custom-class" />);

      expect(container.querySelector('.tag-panel')).toHaveClass('custom-class');
    });
  });

  describe('readonly mode', () => {
    it('does not enter edit mode when readonly', () => {
      const { container } = render(<TagPanel {...defaultProps} readonly />);

      fireEvent.click(container.querySelector('.tag-panel')!);

      expect(container.querySelector('.edit-mode')).not.toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    it('enters edit mode when clicked', () => {
      const { container } = render(<TagPanel {...defaultProps} />);

      fireEvent.click(container.querySelector('.tag-panel')!);

      expect(container.querySelector('.edit-mode')).toBeInTheDocument();
    });

    it('shows edit panel always when alwaysShowEditPanel is true', () => {
      const { container } = render(<TagPanel {...defaultProps} alwaysShowEditPanel />);

      expect(container.querySelector('.edit-mode')).toBeInTheDocument();
    });
  });

  describe('as prop', () => {
    it('renders as div by default', () => {
      const { container } = render(<TagPanel {...defaultProps} />);

      expect(container.querySelector('div.tag-panel')).toBeInTheDocument();
    });

    it('renders as custom element', () => {
      const { container } = render(<TagPanel {...defaultProps} as="section" />);

      expect(container.querySelector('section.tag-panel')).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('accepts onAdd callback prop', () => {
      const onAdd = vi.fn();
      const { container } = render(<TagPanel {...defaultProps} selectedItems={[]} onAdd={onAdd} alwaysShowEditPanel />);

      // Verify the combobox is rendered for adding items
      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('accepts onRemove callback prop', () => {
      const onRemove = vi.fn();
      const { container } = render(<TagPanel {...defaultProps} onRemove={onRemove} alwaysShowEditPanel />);

      // Verify the component renders with edit panel
      expect(container.querySelector('.tag-panel.edit-mode')).toBeInTheDocument();
    });
  });

  describe('creatable', () => {
    it('accepts creatable prop', () => {
      render(<TagPanel {...defaultProps} creatable alwaysShowEditPanel />);

      // Component should render without error with creatable prop
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('exits edit mode on Enter key', () => {
      const { container } = render(<TagPanel {...defaultProps} />);

      fireEvent.click(container.querySelector('.tag-panel')!);
      expect(container.querySelector('.edit-mode')).toBeInTheDocument();

      fireEvent.keyUp(container.querySelector('.tag-panel')!, { key: 'Enter' });
      expect(container.querySelector('.edit-mode')).not.toBeInTheDocument();
    });

    it('exits edit mode on Tab key', () => {
      const { container } = render(<TagPanel {...defaultProps} />);

      fireEvent.click(container.querySelector('.tag-panel')!);
      expect(container.querySelector('.edit-mode')).toBeInTheDocument();

      fireEvent.keyUp(container.querySelector('.tag-panel')!, { key: 'Tab' });
      expect(container.querySelector('.edit-mode')).not.toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(TagPanel.displayName).toBe('TagPanel');
    });
  });
});

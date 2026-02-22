import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeSample } from '../ThemeSample';
import { Theme } from '../../models';

describe('ThemeSample', () => {
  const lightTheme: Theme = { name: 'Light', theme: '', colour: '#ffffff' };
  const darkTheme: Theme = { name: 'Dark', theme: 'dark', colour: '#000000' };

  describe('rendering', () => {
    it('renders theme sample', () => {
      const { container } = render(<ThemeSample theme={lightTheme} onClick={() => {}} />);

      expect(container.querySelector('.theme-sample')).toBeInTheDocument();
    });

    it('applies clickable class', () => {
      const { container } = render(<ThemeSample theme={lightTheme} onClick={() => {}} />);

      expect(container.querySelector('.clickable')).toBeInTheDocument();
    });

    it('applies theme class based on theme.theme', () => {
      const { container } = render(<ThemeSample theme={darkTheme} onClick={() => {}} />);

      expect(container.querySelector('.theme-sample')).toHaveClass('dark');
    });

    it('applies lowercase theme name when theme.theme is empty', () => {
      const { container } = render(<ThemeSample theme={lightTheme} onClick={() => {}} />);

      expect(container.querySelector('.theme-sample')).toHaveClass('light');
    });
  });

  describe('onClick', () => {
    it('calls onClick with theme when clicked', () => {
      const onClick = vi.fn();
      const { container } = render(<ThemeSample theme={darkTheme} onClick={onClick} />);

      fireEvent.click(container.querySelector('.theme-sample')!);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(darkTheme);
    });
  });

  describe('different themes', () => {
    it('renders correctly for various theme configurations', () => {
      const customTheme: Theme = { name: 'Custom', theme: 'dark blue', colour: '#333' };
      const { container } = render(<ThemeSample theme={customTheme} onClick={() => {}} />);

      expect(container.querySelector('.theme-sample')).toHaveClass('dark blue');
    });
  });
});

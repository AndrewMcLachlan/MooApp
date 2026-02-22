import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditColumn } from '../EditColumn';

describe('EditColumn', () => {
  describe('rendering', () => {
    it('renders as td element', () => {
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" /></tr></tbody></table>
      );

      expect(container.querySelector('td')).toBeInTheDocument();
    });

    it('displays value when not editing', () => {
      render(
        <table><tbody><tr><EditColumn value="test value" /></tr></tbody></table>
      );

      expect(screen.getByText('test value')).toBeInTheDocument();
    });

    it('displays children when provided and not editing', () => {
      render(
        <table><tbody><tr><EditColumn value="test">Custom Display</EditColumn></tr></tbody></table>
      );

      expect(screen.getByText('Custom Display')).toBeInTheDocument();
    });

    it('applies className to td', () => {
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" className="custom-col" /></tr></tbody></table>
      );

      expect(container.querySelector('td')).toHaveClass('custom-col');
    });
  });

  describe('edit mode', () => {
    it('shows input when clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('input has initial value', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test value" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('input has autofocus', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('input has form-control class', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('textbox')).toHaveClass('form-control');
    });
  });

  describe('onChange callback', () => {
    it('calls onChange on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" onChange={onChange} /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);
      await user.tab();

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange on Enter key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" onChange={onChange} /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange on Tab key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" onChange={onChange} /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);
      await user.keyboard('{Tab}');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('input type', () => {
    it('defaults to text type', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="test" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('accepts custom type', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <table><tbody><tr><EditColumn value="123" type="number" /></tr></tbody></table>
      );

      await user.click(container.querySelector('td')!);

      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(EditColumn.displayName).toBe('EditColumn');
    });
  });
});

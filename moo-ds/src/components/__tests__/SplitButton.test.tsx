import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitButton } from '../SplitButton';
import { Menu } from '../Menu';

const toggle = () => screen.getByRole('button', { name: 'More options' });

describe('SplitButton', () => {
  it('runs the default action from the label', () => {
    const onClick = vi.fn();
    render(
      <SplitButton id="add" label="Add transaction" onClick={onClick}>
        <Menu.Item onClick={vi.fn()}>Add transfer</Menu.Item>
      </SplitButton>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Add transfer')).not.toBeInTheDocument();
  });

  it('opens the menu from the toggle without running the default action', () => {
    const onClick = vi.fn();
    render(
      <SplitButton id="add" label="Add transaction" onClick={onClick}>
        <Menu.Item onClick={vi.fn()}>Add transfer</Menu.Item>
      </SplitButton>
    );
    fireEvent.click(toggle());
    expect(screen.getByRole('menuitem', { name: 'Add transfer' })).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('runs a menu item', () => {
    const onTransfer = vi.fn();
    render(
      <SplitButton id="add" label="Add transaction">
        <Menu.Item onClick={onTransfer}>Add transfer</Menu.Item>
      </SplitButton>
    );
    fireEvent.click(toggle());
    fireEvent.click(screen.getByText('Add transfer'));
    expect(onTransfer).toHaveBeenCalledTimes(1);
  });

  it('reports whether the menu is open on the toggle', () => {
    render(
      <SplitButton id="add" label="Add transaction">
        <Menu.Item onClick={vi.fn()}>Add transfer</Menu.Item>
      </SplitButton>
    );
    expect(toggle()).toHaveAttribute('aria-haspopup', 'menu');
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('names the toggle from toggleLabel', () => {
    render(
      <SplitButton id="save" label="Save" toggleLabel="More save options">
        <Menu.Item onClick={vi.fn()}>Save as draft</Menu.Item>
      </SplitButton>
    );
    expect(screen.getByRole('button', { name: 'More save options' })).toBeInTheDocument();
  });

  it('applies the variant and size to both halves', () => {
    render(
      <SplitButton id="save" label="Save" variant="outline-primary" size="sm">
        <Menu.Item onClick={vi.fn()}>Save as draft</Menu.Item>
      </SplitButton>
    );
    for (const button of [screen.getByRole('button', { name: 'Save' }), toggle()]) {
      expect(button).toHaveClass('btn-outline-primary', 'btn-sm');
    }
  });

  it('disables both halves', () => {
    render(
      <SplitButton id="save" label="Save" disabled>
        <Menu.Item onClick={vi.fn()}>Save as draft</Menu.Item>
      </SplitButton>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(toggle()).toBeDisabled();
  });

  it('renders a leading icon on the default action', () => {
    const { container } = render(
      <SplitButton id="add" label="Add" icon="plus">
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </SplitButton>
    );
    expect(container.querySelector('.btn-icon')).toBeInTheDocument();
  });
});

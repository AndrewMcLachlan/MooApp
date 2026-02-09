import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FromGroupProvider, useFormGroup } from '../FormGroupProvider';

// Test component to access context
const GroupIdConsumer = () => {
  const { groupId } = useFormGroup();
  return <span data-testid="group-id">{groupId ?? 'undefined'}</span>;
};

describe('FormGroupProvider', () => {
  describe('context provision', () => {
    it('provides groupId to children', () => {
      render(
        <FromGroupProvider groupId="testGroup">
          <GroupIdConsumer />
        </FromGroupProvider>
      );

      expect(screen.getByTestId('group-id')).toHaveTextContent('testGroup');
    });

    it('provides undefined groupId by default', () => {
      // Using useFormGroup outside of provider
      render(<GroupIdConsumer />);

      expect(screen.getByTestId('group-id')).toHaveTextContent('undefined');
    });
  });

  describe('useFormGroup hook', () => {
    it('returns groupId from context', () => {
      render(
        <FromGroupProvider groupId="myFieldId">
          <GroupIdConsumer />
        </FromGroupProvider>
      );

      expect(screen.getByTestId('group-id')).toHaveTextContent('myFieldId');
    });

    it('works with different groupId values', () => {
      const { rerender } = render(
        <FromGroupProvider groupId="first">
          <GroupIdConsumer />
        </FromGroupProvider>
      );

      expect(screen.getByTestId('group-id')).toHaveTextContent('first');

      rerender(
        <FromGroupProvider groupId="second">
          <GroupIdConsumer />
        </FromGroupProvider>
      );

      expect(screen.getByTestId('group-id')).toHaveTextContent('second');
    });
  });

  describe('nested providers', () => {
    it('inner provider overrides outer provider', () => {
      render(
        <FromGroupProvider groupId="outer">
          <FromGroupProvider groupId="inner">
            <GroupIdConsumer />
          </FromGroupProvider>
        </FromGroupProvider>
      );

      expect(screen.getByTestId('group-id')).toHaveTextContent('inner');
    });
  });

  describe('children rendering', () => {
    it('renders children', () => {
      render(
        <FromGroupProvider groupId="test">
          <div data-testid="child-content">Content</div>
        </FromGroupProvider>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <FromGroupProvider groupId="test">
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </FromGroupProvider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});

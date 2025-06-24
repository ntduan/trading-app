import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { getByRole } = render(<Checkbox className="custom-class" />);
    expect(getByRole('checkbox')).toHaveClass('custom-class');
  });

  it('renders the indicator (CheckIcon) when checked', () => {
    const { getByRole, getByTestId } = render(<Checkbox checked data-testid="checkbox" />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeChecked();
    // The indicator should be present
    expect(checkbox.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument();
    // The CheckIcon should be present
    expect(checkbox.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onCheckedChange when clicked', () => {
    const handleChange = vi.fn();
    const { getByRole } = render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    const { getByRole } = render(<Checkbox disabled />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('applies aria-invalid when invalid', () => {
    const { getByRole } = render(<Checkbox aria-invalid />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards other props', () => {
    const { getByRole } = render(<Checkbox data-testid="my-checkbox" />);
    expect(getByRole('checkbox')).toHaveAttribute('data-testid', 'my-checkbox');
  });
});

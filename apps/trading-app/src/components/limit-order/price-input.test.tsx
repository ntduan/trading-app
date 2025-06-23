import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PriceInput } from './price-input';

describe('PriceInput', () => {
  it('renders with default props', () => {
    const handleChange = vi.fn();
    const { getByDisplayValue, getByText } = render(<PriceInput value={100} onChange={handleChange} />);
    expect(getByDisplayValue('100')).toBeInTheDocument();
    expect(getByText('Price')).toBeInTheDocument();
    expect(getByText('USDT')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    const { getByDisplayValue } = render(<PriceInput value={100} onChange={handleChange} />);
    const input = getByDisplayValue('100') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(handleChange).toHaveBeenCalledWith(123.45);
  });

  it('calls onChange with value + step when up button is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(<PriceInput value={50} onChange={handleChange} step={5} />);
    const upButton = container.querySelectorAll('button')[0];
    fireEvent.click(upButton);
    expect(handleChange).toHaveBeenCalledWith(55);
  });

  it('calls onChange with value - step when down button is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(<PriceInput value={50} onChange={handleChange} step={5} />);
    const downButton = container.querySelectorAll('button')[1];
    fireEvent.click(downButton);
    expect(handleChange).toHaveBeenCalledWith(45);
  });

  it('uses default step=1 if not provided', () => {
    const handleChange = vi.fn();
    const { container } = render(<PriceInput value={10} onChange={handleChange} />);
    const upButton = container.querySelectorAll('button')[0];
    fireEvent.click(upButton);
    expect(handleChange).toHaveBeenCalledWith(11);
  });

  it('input has correct attributes', () => {
    const handleChange = vi.fn();
    const { getByDisplayValue } = render(<PriceInput value={77} onChange={handleChange} step={0.5} />);
    const input = getByDisplayValue('77') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.step).toBe('0.5');
    expect(input.className).toContain('text-right');
  });

  it('does not crash if input is emptied', () => {
    const handleChange = vi.fn();
    const { getByDisplayValue } = render(<PriceInput value={88} onChange={handleChange} />);
    const input = getByDisplayValue('88') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith(NaN);
  });
});

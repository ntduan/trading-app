import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AmountInput } from './amount-input';
import '@testing-library/jest-dom';

describe('AmountInput', () => {
  it('renders label, value, and unit', () => {
    const { getByText, getByDisplayValue } = render(
      <AmountInput label="Amount" value="10.00" onChange={() => {}} unit="USD" />
    );
    expect(getByText('Amount')).toBeInTheDocument();
    expect(getByDisplayValue('10.00')).toBeInTheDocument();
    expect(getByText('USD')).toBeInTheDocument();
  });

  it('calls onChange with limited decimals', () => {
    const onChange = vi.fn();
    const { getByDisplayValue } = render(
      <AmountInput label="Amount" value="10.12345" onChange={onChange} maxDecimals={2} />
    );
    const input = getByDisplayValue('10.12345') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20.98765' } });
    expect(onChange).toHaveBeenCalledWith('20.98');
  });

  it('does not allow negative values', () => {
    const onChange = vi.fn();
    const { getByDisplayValue } = render(<AmountInput label="Amount" value="5" onChange={onChange} />);
    const input = getByDisplayValue('5') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '-1' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('increments value by step when up button is clicked', () => {
    const onChange = vi.fn();
    const { container } = render(
      <AmountInput label="Amount" value="2" onChange={onChange} step={0.5} maxDecimals={2} />
    );
    const upButton = container.querySelectorAll('button')[0];
    fireEvent.click(upButton);
    expect(onChange).toHaveBeenCalledWith('2.50');
  });

  it('decrements value by step when down button is clicked', () => {
    const onChange = vi.fn();
    const { container } = render(
      <AmountInput label="Amount" value="2" onChange={onChange} step={0.5} maxDecimals={2} />
    );
    const downButton = container.querySelectorAll('button')[1];
    fireEvent.click(downButton);
    expect(onChange).toHaveBeenCalledWith('1.50');
  });

  it('blurs input on wheel event', () => {
    const { getByDisplayValue } = render(<AmountInput label="Amount" value="10" onChange={() => {}} />);
    const input = getByDisplayValue('10') as HTMLInputElement;
    input.blur = vi.fn();
    fireEvent.wheel(input);
    expect(input.blur).toHaveBeenCalled();
  });

  it('defaults step to 1 and maxDecimals to 2', () => {
    const onChange = vi.fn();
    const { container } = render(<AmountInput label="Amount" value="1" onChange={onChange} />);
    const upButton = container.querySelectorAll('button')[0];
    fireEvent.click(upButton);
    expect(onChange).toHaveBeenCalledWith('2.00');
  });
});

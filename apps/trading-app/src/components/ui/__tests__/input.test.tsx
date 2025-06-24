import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

import { Input } from '../input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('applies the provided className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('sets the type attribute', () => {
    render(<Input type="password" aria-label="password" />);
    const input = screen.getByLabelText('password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('spreads additional props', () => {
    render(<Input data-testid="my-input" aria-label="myinput" />);
    const input = screen.getByLabelText('myinput');
    expect(input).toHaveAttribute('data-testid', 'my-input');
  });

  it('applies disabled styles and attributes', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:pointer-events-none');
  });

  it('applies aria-invalid styles', () => {
    render(<Input aria-invalid="true" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // Class presence is implementation detail, but we can check for border-destructive
    expect(input.className).toMatch(/border-destructive/);
  });

  it('calls onChange handler', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders file input with file: classes', () => {
    render(<Input type="file" data-testid="file-input" />);
    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input.className).toMatch(/file:/);
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('has data-slot="input"', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-slot', 'input');
  });
});

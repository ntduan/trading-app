import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Button, buttonVariants } from './button';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

describe('buttonVariants', () => {
  it('returns correct classes for default variant and size', () => {
    const result = buttonVariants({});
    expect(result).toContain('bg-primary');
    expect(result).toContain('h-9');
  });

  it('returns correct classes for destructive variant', () => {
    const result = buttonVariants({ variant: 'destructive' });
    expect(result).toContain('bg-destructive');
  });

  it('returns correct classes for outline variant', () => {
    const result = buttonVariants({ variant: 'outline' });
    expect(result).toContain('border');
    expect(result).toContain('bg-background');
  });

  it('returns correct classes for secondary variant', () => {
    const result = buttonVariants({ variant: 'secondary' });
    expect(result).toContain('bg-secondary');
  });

  it('returns correct classes for ghost variant', () => {
    const result = buttonVariants({ variant: 'ghost' });
    expect(result).toContain('hover:bg-accent');
  });

  it('returns correct classes for link variant', () => {
    const result = buttonVariants({ variant: 'link' });
    expect(result).toContain('text-primary');
    expect(result).toContain('hover:underline');
  });

  it('returns correct classes for sm size', () => {
    const result = buttonVariants({ size: 'sm' });
    expect(result).toContain('h-8');
  });

  it('returns correct classes for lg size', () => {
    const result = buttonVariants({ size: 'lg' });
    expect(result).toContain('h-10');
  });

  it('returns correct classes for icon size', () => {
    const result = buttonVariants({ size: 'icon' });
    expect(result).toContain('size-9');
  });

  it('merges custom className', () => {
    const result = buttonVariants({ className: 'custom-class' });
    expect(result).toContain('custom-class');
  });
});

describe('Button', () => {
  it('renders a button by default', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Click me');
    expect(btn).toHaveAttribute('data-slot', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-destructive');
    expect(btn.className).toContain('h-10');
  });

  it('applies custom className', () => {
    render(<Button className="my-class">Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('my-class');
  });

  it('passes props to button', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Test
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled(); // because disabled
  });

  it('renders as Slot when asChild is true', () => {
    // Mock Slot to render a span for test
    type TestSlotProps = React.HTMLAttributes<HTMLSpanElement>;
    const TestSlot = React.forwardRef<HTMLSpanElement, TestSlotProps>((props, ref) => <span ref={ref} {...props} />);
    TestSlot.displayName = 'TestSlot';
    render(
      <Button asChild>
        <TestSlot data-testid="slot-element">Slot Child</TestSlot>
      </Button>
    );
    const slot = screen.getByTestId('slot-element');
    expect(slot).toBeInTheDocument();
    expect(slot).toHaveTextContent('Slot Child');
    expect(slot).toHaveAttribute('data-slot', 'button');
  });

  it('forwards all props to Slot or button', () => {
    render(
      <Button aria-label="labelled" tabIndex={2}>
        A
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'labelled');
    expect(btn).toHaveAttribute('tabIndex', '2');
  });
});

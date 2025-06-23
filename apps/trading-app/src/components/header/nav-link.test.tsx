import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NavLink } from './nav-link';

// Mock next/link and next/navigation
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
let mockPathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('NavLink', () => {
  beforeEach(() => {
    mockPathname = '/';
  });

  it('renders children', () => {
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies active class when exact match and pathname matches', () => {
    mockPathname = '/about';
    render(
      <NavLink href="/about" exact>
        About
      </NavLink>
    );
    const link = screen.getByText('About');
    expect(link.className).toContain('text-primary-light');
  });

  it('does not apply active class when exact match and pathname does not match', () => {
    mockPathname = '/about';
    render(
      <NavLink href="/contact" exact>
        Contact
      </NavLink>
    );
    const link = screen.getByText('Contact');
    expect(link.className.split(' ')).not.toContain('text-primary-light');
  });

  it('applies active class when pathname starts with href (not exact)', () => {
    mockPathname = '/dashboard/settings';
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByText('Dashboard');
    expect(link.className).toContain('text-primary-light');
  });

  it('does not apply active class when pathname does not start with href (not exact)', () => {
    mockPathname = '/profile';
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByText('Dashboard');
    expect(link.className.split(' ')).not.toContain('text-primary-light');
  });

  it('applies active class only when pathname is exactly "/" for root href', () => {
    mockPathname = '/';
    render(<NavLink href="/">Root</NavLink>);
    const link = screen.getByText('Root');
    expect(link.className).toContain('text-primary-light');

    mockPathname = '/something';
    render(<NavLink href="/">Root2</NavLink>);
    const link2 = screen.getByText('Root2');
    expect(link2.className.split(' ')).not.toContain('text-primary-light');
  });

  it('merges className prop', () => {
    render(
      <NavLink href="/" className="custom-class">
        Custom
      </NavLink>
    );
    const link = screen.getByText('Custom');
    expect(link.className).toContain('custom-class');
  });

  it('passes extra props to Link', () => {
    render(
      <NavLink href="/" data-testid="nav-link">
        Test
      </NavLink>
    );
    expect(screen.getByTestId('nav-link')).toBeInTheDocument();
  });
});

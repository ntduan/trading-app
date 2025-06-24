import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Header } from '../header';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock NavLink
vi.mock('../nav-link', () => ({
  NavLink: ({ href, children, className }: React.PropsWithChildren<{ href: string; className?: string }>) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock SwitchTheme
vi.mock('../switch-theme', () => ({
  SwitchTheme: () => <button>Switch Theme</button>,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('Header', () => {
  it('renders the header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the Trading App title with link to /trade', () => {
    render(<Header />);
    const titleLink = screen.getByRole('link', { name: /trading app/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/trade');
  });

  it('renders navigation links', () => {
    render(<Header />);
    const tradeLink = screen.getByRole('link', { name: /trade/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(tradeLink).toBeInTheDocument();
    expect(tradeLink).toHaveAttribute('href', '/trade');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders the SwitchTheme component', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /switch theme/i })).toBeInTheDocument();
  });

  it('applies correct class names', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-card');
    expect(header).toHaveClass('text-foreground');
    expect(header).toHaveClass('px-6');
    expect(header).toHaveClass('py-5');
  });
});

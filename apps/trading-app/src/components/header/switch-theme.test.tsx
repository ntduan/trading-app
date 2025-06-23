import { render, fireEvent, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect, type Mock } from 'vitest';

import { SwitchTheme } from './switch-theme';

import { useMounted } from '@/hooks/useIsMounted';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock useMounted hook
vi.mock('@/hooks/useIsMounted', () => ({
  useMounted: vi.fn(),
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('SwitchTheme', () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null if not mounted', () => {
    (useMounted as unknown as Mock).mockReturnValue(false);
    (useTheme as unknown as Mock).mockReturnValue({ setTheme, theme: 'dark' });

    const { container } = render(<SwitchTheme />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Sun icon and toggles to light when theme is dark', () => {
    (useMounted as unknown as Mock).mockReturnValue(true);
    (useTheme as unknown as Mock).mockReturnValue({ setTheme, theme: 'dark' });

    render(<SwitchTheme />);
    // Sun icon has title "Sun" in lucide-react
    expect(screen.getByTestId('lucide-sun')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('lucide-sun').parentElement!);
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('renders Moon icon and toggles to dark when theme is light', () => {
    (useMounted as unknown as Mock).mockReturnValue(true);
    (useTheme as unknown as Mock).mockReturnValue({ setTheme, theme: 'light' });

    render(<SwitchTheme />);
    // Moon icon has title "Moon" in lucide-react
    expect(screen.getByTestId('lucide-moon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('lucide-moon').parentElement!);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('applies custom className and default classes', () => {
    (useMounted as unknown as Mock).mockReturnValue(true);
    (useTheme as unknown as Mock).mockReturnValue({ setTheme, theme: 'dark' });

    const { container } = render(<SwitchTheme className="custom-class" />);
    expect(container.firstChild).toHaveClass('cursor-pointer');
    expect(container.firstChild).toHaveClass('hover:text-primary-light');
    expect(container.firstChild).toHaveClass('font-bold');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

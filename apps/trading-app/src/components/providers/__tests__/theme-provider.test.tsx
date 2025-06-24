import { render } from '@testing-library/react';
import React from 'react';
import { beforeAll, describe, it, expect, vi } from 'vitest';

import { ThemeProvider } from '../theme-provider';

describe('ThemeProvider', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>Test Child</span>
      </ThemeProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('passes props to NextThemesProvider', () => {
    // The NextThemesProvider supports a "defaultTheme" prop
    const { getByTestId } = render(
      <ThemeProvider defaultTheme="dark">
        <span data-testid="child">Child</span>
      </ThemeProvider>
    );
    expect(getByTestId('child')).toBeInTheDocument();
  });
});

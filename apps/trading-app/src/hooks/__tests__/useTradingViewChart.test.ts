/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTradingViewChart, getOverrides } from '../useTradingViewChart';

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useAtomValue: vi.fn(() => 'BTCUSDT'),
  };
});

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

vi.mock('./useExchangeAdapter', () => ({
  useExchangeAdapter: () => ({ adapter: {} }),
}));

vi.mock('./useIsDesktop', () => ({
  useIsDesktop: () => true,
}));

vi.mock('@/lib/data-feed', () => ({
  Datafeed: vi.fn().mockImplementation(() => ({})),
}));

const mockWidget = {
  getTheme: vi.fn(() => 'dark'),
  onChartReady: vi.fn((cb) => cb()),
  activeChart: vi.fn(() => ({
    createStudy: vi.fn(),
    onDataLoaded: vi.fn(() => ({ subscribe: vi.fn((_, cb) => cb && cb()) })),
    resolution: vi.fn(() => '1'),
  })),
  subscribe: vi.fn(),
  setSymbol: vi.fn((symbol, res, cb) => cb && cb()),
};

// @ts-expect-error: Widget is injected globally by the charting library in real usage
(globalThis as any).Widget = vi.fn(() => mockWidget);

describe('getOverrides', () => {
  it('returns overrides for dark theme', () => {
    expect(getOverrides('dark')).toHaveProperty('paneProperties.background', '#0f1a1f');
  });
  it('returns undefined for non-dark theme', () => {
    expect(getOverrides('light')).toBeUndefined();
  });
});



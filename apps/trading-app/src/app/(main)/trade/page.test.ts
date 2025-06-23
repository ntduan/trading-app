import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(), // inline declaration!
  };
});

vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof import('jotai')>('jotai');

  return {
    ...actual,
    useAtom: vi.fn(), // inline declaration!
  };
});

import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';

import TradeRootPage from './page';

describe('TradeRootPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to active trading pair when set', () => {
    vi.mocked(useAtom).mockReturnValue(['ETHUSDT', vi.fn() as never]);

    TradeRootPage();

    expect(redirect).toHaveBeenCalledWith('/trade/ETHUSDT');
  });

  it('redirects to BTCUSDT when no active pair is set', () => {
    vi.mocked(useAtom).mockReturnValue([null, vi.fn() as never]);

    TradeRootPage();

    expect(redirect).toHaveBeenCalledWith('/trade/BTCUSDT');
  });
});

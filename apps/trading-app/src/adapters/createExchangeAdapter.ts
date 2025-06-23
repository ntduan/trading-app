import { type Bar } from 'tv-charting-library';

import { type TradingPair } from '@/app/api/pairs/getTradingPairs';

export type Side = 'bids' | 'asks';
export type RawOrder = [string, string];

export interface IExchangeAdapter {
  readonly id: string;
  readonly name: string;
  readonly type: string;

  subscribeOrderbook(symbol: string, onRealtimeCallback: (bids: RawOrder[], ask: RawOrder[]) => void): () => void;
  subscribeKlines(
    symbol: string,
    resolution: string,
    onRealtimeCallback: (bar: Bar) => void,
    listenerGuid: string
  ): void;
  unsubscribeKlines(listenerGuid: string): void;
  getHistory(symbol: string, resolution: string, from: number, to: number): Promise<Bar[]>;
  placeOrder(order: {
    pair: string;
    price: number;
    size: number;
    side: 'buy' | 'sell';
    postOnly?: boolean;
  }): Promise<{ status: 'accepted' | 'rejected'; orderId?: string; message?: string }>;
  setupTradingPairs(paris: TradingPair[]): void;
  getSupportedTradingPairs(): TradingPair[];
}

export type ExchangeAdapterWithProperties<properties extends Record<string, unknown> = Record<string, unknown>> =
  IExchangeAdapter & properties;

export type CreateExchangeAdapterFn<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider = unknown,
  properties extends Record<string, unknown> = Record<string, unknown>,
> = (config?: unknown) => ExchangeAdapterWithProperties<properties>;

export function createExchangeAdapter<
  provider = unknown,
  properties extends Record<string, unknown> = Record<string, unknown>,
  createAdapterFn extends CreateExchangeAdapterFn<provider, properties> = CreateExchangeAdapterFn<provider, properties>,
>(createAdapterFn: createAdapterFn) {
  return createAdapterFn;
}

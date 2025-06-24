import { type Bar } from 'tv-charting-library';

import { type TradingPair } from '@/app/api/pairs/getTradingPairs';

export type Side = 'bids' | 'asks';
export type RawOrder = [string, string];
export interface SocketConnection {
  ws: WebSocket;
  type: string;
}

export interface IExchangeAdapter {
  id: string;
  name: string;
  subscribeOrderbook: (symbol: string, onRealtimeCallback: (bids: RawOrder[], asks: RawOrder[]) => void) => void;
  subscribeKlines: (
    symbol: string,
    resolution: string,
    onRealtimeCallback: (bar: Bar) => void,
    listenerGuid: string
  ) => void;
  unsubscribeKlines: (listenerGuid: string) => void;
  getHistory: (symbol: string, resolution: string, from: number, to: number) => Promise<Bar[]>;
  setupTradingPairs: (tradingPairs: TradingPair[]) => void;
  getSupportedTradingPairs: () => TradingPair[];
}

import { type Bar } from 'tv-charting-library';

import { SocketManager } from '../socket-manager';

import { type IExchangeAdapter } from '../types';

import { subscribeKlines, getHistory } from './klines';
import { subscribeOrderbook } from './orderbook';
import { type SocketConnection } from './types';

import { type TradingPair } from '@/app/api/pairs/getTradingPairs';

export const binance = (): IExchangeAdapter => {
  let supportedTradingPairs: TradingPair[] = [];
  const name = 'Binance';
  const socketManager = new SocketManager();

  return {
    id: 'binance',
    name,

    subscribeOrderbook,

    subscribeKlines(symbol: string, resolution: string, onRealtimeCallback: (bar: Bar) => void, listenerGuid: string) {
      const ws = subscribeKlines(symbol, resolution, onRealtimeCallback);
      if (!ws.ws) throw new Error('WebSocket not connected');
      const connection: SocketConnection = {
        ws: ws.ws,
        type: 'klines',
      };
      socketManager.addSocket(listenerGuid, connection);
    },

    unsubscribeKlines(listenerGuid: string) {
      if (listenerGuid) {
        socketManager.removeSocket(listenerGuid);
      } else {
        for (const [key, connection] of socketManager.getAllConnections()) {
          if (connection.type === 'klines') {
            socketManager.removeSocket(key);
          }
        }
      }
    },

    getHistory,

    setupTradingPairs(tradingPairs: TradingPair[]) {
      supportedTradingPairs = tradingPairs;
    },

    getSupportedTradingPairs() {
      return supportedTradingPairs;
    },
  };
};

import { type Bar } from 'tv-charting-library';

import { createExchangeAdapter, type ExchangeAdapterWithProperties, type RawOrder } from './createExchangeAdapter';

import { type TradingPair } from '@/app/api/pairs/getTradingPairs';
import { resolutionToBinanceInterval } from '@/lib/utils';

type BinanceOrder = {
  pair: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  postOnly?: boolean;
};

type BinanceOrderResult = {
  status: 'accepted' | 'rejected';
  orderId?: string;
  message?: string;
};

type SocketConnection = {
  ws: WebSocket;
  type: 'orderbook' | 'klines' | 'general';
};

type Orderbook = Map<string, string>;

interface DepthUpdateEvent {
  e: 'depthUpdate';
  E: number;
  s: string;
  U: number; // First update ID
  u: number; // Final update ID
  b: [string, string][]; // bids
  a: [string, string][]; // asks
}

interface Snapshot {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

function applyDelta(book: Orderbook, updates: [string, string][]) {
  for (const [price, size] of updates) {
    if (Number(size) === 0) book.delete(price);
    else book.set(price, size);
  }
}

async function fetchSnapshot(symbol: string): Promise<Snapshot> {
  const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`);
  return res.json();
}

export const binance = () => {
  let supportedTradingPairs: TradingPair[] = [];
  const name = 'Binance';
  const socketConnections = new Map<string, SocketConnection>();

  const addSocket = (key: string, connection: SocketConnection) => {
    if (socketConnections.has(key)) {
      removeSocket(key);
    }
    socketConnections.set(key, connection);
  };

  const removeSocket = (key: string) => {
    const connection = socketConnections.get(key);
    if (connection) {
      connection.ws.close();
      socketConnections.delete(key);
    }
  };

  const closeAllSockets = () => {
    for (const [key] of socketConnections) {
      removeSocket(key);
    }
  };

  return createExchangeAdapter<unknown, ExchangeAdapterWithProperties>((config) => ({
    id: 'binance',
    name: name,
    type: 'spot',

    subscribeOrderbook(symbol: string, onRealtimeCallback: (bids: RawOrder[], ask: RawOrder[]) => void) {
      const bids: Orderbook = new Map();
      const asks: Orderbook = new Map();
      let lastUpdateId = 0;
      let snapshotLoaded = false;
      const buffer: DepthUpdateEvent[] = [];

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth@1000ms`);

      ws.onmessage = (event) => {
        const data: DepthUpdateEvent = JSON.parse(event.data.toString());

        if (!snapshotLoaded) {
          buffer.push(data);
          return;
        }

        if (data.u <= lastUpdateId) return;
        if (data.U > lastUpdateId + 1) {
          console.warn('[Orderbook] GAP detected, resync needed');
          return;
        }

        applyDelta(bids, data.b);
        applyDelta(asks, data.a);
        lastUpdateId = data.u;

        onRealtimeCallback(Array.from(bids.entries()), Array.from(asks.entries()));
      };

      fetchSnapshot(symbol).then((snapshot) => {
        for (const [price, size] of snapshot.bids) bids.set(price, size);
        for (const [price, size] of snapshot.asks) asks.set(price, size);
        lastUpdateId = snapshot.lastUpdateId;
        console.log(`[Orderbook] Snapshot loaded for ${symbol}`, { bids, asks });
        for (const patch of buffer) {
          if (patch.u <= lastUpdateId) continue;
          if (patch.U > lastUpdateId + 1) {
            console.warn('[Orderbook] GAP detected in buffer');
            return;
          }
          applyDelta(bids, patch.b);
          applyDelta(asks, patch.a);
          lastUpdateId = patch.u;
        }

        snapshotLoaded = true;
        console.log(`[Orderbook] Buffer processed for ${symbol}`, { bids, asks });
        onRealtimeCallback(Array.from(bids.entries()), Array.from(asks.entries()));
      });

      return () => ws.close();
    },

    subscribeKlines(symbol: string, resolution: string, onRealtimeCallback: (bar: Bar) => void, listenerGuid: string) {
      console.log(`Subscribing to klines for ${symbol} with resolution ${resolution}`);
      // TODO: Send subscription message for klines
      const interval = resolutionToBinanceInterval(resolution);
      const symbolStr = symbol.replace('/', '').toLowerCase();
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolStr}@kline_${interval}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const k = data.k;
        const bar: Bar = {
          time: k.t,
          low: parseFloat(k.l),
          high: parseFloat(k.h),
          open: parseFloat(k.o),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };
        onRealtimeCallback(bar);
      };

      const connection: SocketConnection = {
        ws,
        type: 'klines',
      };

      addSocket(listenerGuid, connection);
    },

    unsubscribeKlines(listenerGuid: string) {
      console.log(`Unsubscribing from klines for listenerGuid: ${listenerGuid}`);
      if (listenerGuid) {
        removeSocket(listenerGuid);
      } else {
        // If no specific listenerGuid, remove all klines sockets
        console.log('Removing all klines sockets');
        for (const [key, connection] of socketConnections) {
          if (connection.type === 'klines') {
            removeSocket(key);
          }
        }
      }
    },

    async getHistory(symbol: string, resolution: string, from: number, to: number): Promise<Bar[]> {
      const interval = resolutionToBinanceInterval(resolution);
      const limit = 1000; // Binance max
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.replace('/', '')}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}&limit=${limit}`;

      const res = await fetch(url);
      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((d: any) => ({
        time: d[0],
        low: parseFloat(d[3]),
        high: parseFloat(d[2]),
        open: parseFloat(d[1]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
      }));
    },

    async placeOrder(order: BinanceOrder): Promise<BinanceOrderResult> {
      // Mock order placement
      return { status: 'accepted', orderId: Math.random().toString() };
    },

    setupTradingPairs(tradingPairs: TradingPair[]) {
      supportedTradingPairs = tradingPairs;
    },

    getSupportedTradingPairs() {
      return supportedTradingPairs;
    },
  }));
};

import { type Bar } from 'tv-charting-library';

import { createExchangeAdapter, type ExchangeAdapterWithProperties, type Order } from './createExchangeAdapter';

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

export const binance = (parameters: { apiBaseUrl?: string }) => {
  let ws: WebSocket | null = null;
  let isConnected = false;

  // Internal event handlers
  let onOrderBook: ((data: unknown) => void) | undefined;
  let onKline: ((data: unknown) => void) | undefined;
  let onTrade: ((data: unknown) => void) | undefined;
  let onConnect: (() => void) | undefined;
  let onDisconnect: (() => void) | undefined;
  let onError: ((error: Error) => void) | undefined;
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

    async connect() {
      // Example: connect to Binance WebSocket
      if (ws) return;
      ws = new WebSocket(parameters.apiBaseUrl || 'wss://stream.binance.com:9443/ws');
      ws.onopen = () => {
        isConnected = true;
        onConnect?.();
      };
      ws.onclose = () => {
        isConnected = false;
        onDisconnect?.();
      };
      ws.onerror = (e) => {
        onError?.(new Error('WebSocket error'));
      };
      ws.onmessage = (event) => {
        // TODO: Parse and dispatch orderBook/kline/trade events
        // Example:
        // const data = JSON.parse(event.data)
        // if (data.e === 'depthUpdate') {
        //   config.emitter('orderBook', { pair: data.s, bids: data.b, asks: data.a })
        //   onOrderBook?.(data)
        // }
      };
    },

    async disconnect() {
      if (ws) {
        ws.close();
        ws = null;
      }
    },

    subscribeOrderBook(symbol: string, tickSize: number, onRealtimeCallback: (bids: Order[], ask: Order[]) => void) {
      // TODO: Send subscription message to Binance WS
      // Example: ws?.send(JSON.stringify({ method: 'SUBSCRIBE', params: [`${pair.toLowerCase()}@depth`], id: 1 }))
      const symbolStr = symbol.replace('/', '').toLowerCase();
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolStr}@depth@1000ms`);

      let latestBids: Order[] = [];
      let latestAsks: Order[] = [];

      const worker = new Worker(new URL('@/workers/math.worker.ts', import.meta.url), { type: 'module' });

      worker.onmessage = (event) => {
        const { type, orders } = event.data;
        if (type === 'bids') latestBids = orders;
        if (type === 'asks') latestAsks = orders;

        if (latestBids.length && latestAsks.length) {
          onRealtimeCallback(latestBids, latestAsks);
          latestBids = [];
          latestAsks = [];
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        worker.postMessage({
          type: 'aggregate',
          side: 'bids',
          orders: data.b.map(([p, q]: string[]) => [parseFloat(p), parseFloat(q)]),
          tickSize,
        });
        worker.postMessage({
          type: 'aggregate',
          side: 'asks',
          orders: data.a.map(([p, q]: string[]) => [parseFloat(p), parseFloat(q)]),
          tickSize,
        });
      };
      return { ws, worker };
    },

    unsubscribeOrderBook(connection: { ws: WebSocket; worker: Worker }) {
      // TODO: Send unsubscribe message
      connection.ws.close();
      connection.worker.terminate();
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

export const BinanceAdapter = binance({});

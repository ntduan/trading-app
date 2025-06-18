import { createExchangeAdapter } from './createExchangeAdapter';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BybitAdapterProperties = {
  // You can add custom properties or methods here if needed
};

type BybitOrder = {
  pair: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  postOnly?: boolean;
};

type BybitOrderResult = {
  status: 'accepted' | 'rejected';
  orderId?: string;
  message?: string;
};

export const bybit = (parameters: { apiBaseUrl?: string }) => {
  let ws: WebSocket | null = null;
  let isConnected = false;

  // Internal event handlers
  let onOrderBook: ((data: unknown) => void) | undefined;
  let onKline: ((data: unknown) => void) | undefined;
  let onTrade: ((data: unknown) => void) | undefined;
  let onConnect: (() => void) | undefined;
  let onDisconnect: (() => void) | undefined;
  let onError: ((error: Error) => void) | undefined;

  return createExchangeAdapter<unknown, BybitAdapterProperties>((config) => ({
    id: 'bybit',
    name: 'Bybit',
    type: 'spot',

    async connect() {
      // Example: connect to Bybit WebSocket
      if (ws) return;
      ws = new WebSocket(parameters.apiBaseUrl || 'wss://stream.bybit.com/v5/public/spot');
      ws.onopen = () => {
        isConnected = true;
        config.emitter('connect', { exchange: 'bybit' });
        onConnect?.();
      };
      ws.onclose = () => {
        isConnected = false;
        config.emitter('disconnect', { exchange: 'bybit' });
        onDisconnect?.();
      };
      ws.onerror = (e) => {
        config.emitter('error', { error: new Error('WebSocket error') });
        onError?.(new Error('WebSocket error'));
      };
      ws.onmessage = (event) => {
        // TODO: Parse and dispatch orderBook/kline/trade events
        // Example:
        // const data = JSON.parse(event.data)
        // if (data.topic === 'orderbook') {
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

    subscribeOrderBook(pair: string) {
      // TODO: Send subscription message to Bybit WS
      // Example: ws?.send(JSON.stringify({ op: 'subscribe', args: [`orderbook.1.${pair}`] }))
    },

    unsubscribeOrderBook(pair: string) {
      // TODO: Send unsubscribe message
    },

    subscribeKlines(pair: string, interval: string) {
      // TODO: Send subscription message for klines
    },

    unsubscribeKlines(pair: string, interval: string) {
      // TODO: Send unsubscribe message for klines
    },

    async placeOrder(order: BybitOrder): Promise<BybitOrderResult> {
      // Stub: always reject
      return { status: 'rejected', message: 'Stub only' };
    },

    getSupportedPairs() {
      return config.pairs as string[];
    },
  }));
};

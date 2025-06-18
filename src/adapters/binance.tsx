import { createExchangeAdapter } from './createExchangeAdapter';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BinanceAdapterProperties = {
  // You can add custom properties or methods here if needed
};

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

  return createExchangeAdapter<unknown, BinanceAdapterProperties>((config) => ({
    id: 'binance',
    name: 'Binance',
    type: 'spot',

    async connect() {
      // Example: connect to Binance WebSocket
      if (ws) return;
      ws = new WebSocket(parameters.apiBaseUrl || 'wss://stream.binance.com:9443/ws');
      ws.onopen = () => {
        isConnected = true;
        config.emitter('connect', { exchange: 'binance' });
        onConnect?.();
      };
      ws.onclose = () => {
        isConnected = false;
        config.emitter('disconnect', { exchange: 'binance' });
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

    subscribeOrderBook(pair: string) {
      // TODO: Send subscription message to Binance WS
      // Example: ws?.send(JSON.stringify({ method: 'SUBSCRIBE', params: [`${pair.toLowerCase()}@depth`], id: 1 }))
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

    async placeOrder(order: BinanceOrder): Promise<BinanceOrderResult> {
      // Mock order placement
      return { status: 'accepted', orderId: Math.random().toString() };
    },

    getSupportedPairs() {
      return config.pairs as string[];
    },
  }));
};

export type BinanceOrderResult = {
  status: 'accepted' | 'rejected';
  orderId?: string;
  message?: string;
};

export type SocketConnection = {
  ws: WebSocket;
  type: 'orderbook' | 'klines' | 'general';
};

export type Orderbook = Map<string, string>;

export interface DepthUpdateEvent {
  e: 'depthUpdate';
  E: number;
  s: string;
  U: number; // First update ID
  u: number; // Final update ID
  b: [string, string][]; // bids
  a: [string, string][]; // asks
}

export interface Snapshot {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

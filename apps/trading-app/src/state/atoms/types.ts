export type Order = {
  id: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  pair: string;
  postOnly: boolean;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: number;
};

export type TradingPair = {
  baseAsset: string;
  quoteAsset: string;
};

export type AmountUpdate = {
  asset: string;
  amount: number;
};

export type CancelOrderParams = {
  orderId: string;
  tradingPair: TradingPair;
};

export type EnhancedOrder = Order & {
  baseAsset: string;
  quoteAsset: string;
  unrealizedPnl?: number;
};

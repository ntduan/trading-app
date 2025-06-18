export type AdapterEventMap = {
  orderBook: { pair: string; bids: [number, number][]; asks: [number, number][] };
  kline: { pair: string; interval: string; kline: unknown };
  trade: { pair: string; price: number; size: number; side: 'buy' | 'sell' };
  connect: { exchange: string };
  disconnect: { exchange: string };
  error: { error: Error };
};

export type CreateExchangeAdapterFn<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider = unknown,
  properties extends Record<string, unknown> = Record<string, unknown>,
> = (config: {
  pairs: readonly string[];
  emitter: (event: keyof AdapterEventMap, data: AdapterEventMap[keyof AdapterEventMap]) => void;
}) => {
  readonly id: string;
  readonly name: string;
  readonly type: string;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribeOrderBook(pair: string): void;
  unsubscribeOrderBook(pair: string): void;
  subscribeKlines(pair: string, interval: string): void;
  unsubscribeKlines(pair: string, interval: string): void;
  placeOrder(order: {
    pair: string;
    price: number;
    size: number;
    side: 'buy' | 'sell';
    postOnly?: boolean;
  }): Promise<{ status: 'accepted' | 'rejected'; orderId?: string; message?: string }>;
  getSupportedPairs(): string[];

  // Optional extension properties
} & properties;

export function createExchangeAdapter<
  provider = unknown,
  properties extends Record<string, unknown> = Record<string, unknown>,
  createAdapterFn extends CreateExchangeAdapterFn<provider, properties> = CreateExchangeAdapterFn<provider, properties>,
>(createAdapterFn: createAdapterFn) {
  return createAdapterFn;
}
